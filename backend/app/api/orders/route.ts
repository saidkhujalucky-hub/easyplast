import { env } from "cloudflare:workers";
import {translate,isLanguage,type Language} from "../../messages";
import { getSiteUser } from "../../auth";
import {allowedApiOrigin,apiJson,preflight} from "../../api-access";
import { orderSchema } from "../../order-validation";
import { getUnitPrice, itemCost, products, customProduct } from "../../catalog";

export const dynamic = "force-dynamic";
export const OPTIONS=preflight;
function publicOrder(r: Record<string, unknown>) {
  return {id:r.id, number:r.number, createdAt:r.created_at, status:r.status, items:JSON.parse(String(r.items_json)), delivery:{name:r.name,phone:r.phone,method:r.method,city:r.city,address:r.address,latitude:r.latitude,longitude:r.longitude,comment:r.comment,requestedDate:r.requested_date ?? ""}};
}
export async function GET(request?:Request) {
  const json=(body:unknown,status=200)=>apiJson(request,body,status);
  if(!allowedApiOrigin(request))return json({error:"Недопустимый источник запроса."},403);
  const langValue=request?.headers.get("X-EasyPlast-Language"),lang:Language=isLanguage(langValue)?langValue:"ru";
  const t=(text:string)=>translate(text,lang);
  const user = await getSiteUser(request);
  if (!user) return json({error:t('Войдите в аккаунт, чтобы увидеть свои заявки.')},401);
  try {
    if (!env.DB) throw new Error("DB unavailable");
    const result = await env.DB.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100").bind(user.userId).all();
    return json({orders:result.results.map(publicOrder)});
  } catch { return json({error:t('Не удалось загрузить заявки. Попробуйте ещё раз.')},503); }
}
export async function POST(request: Request) {
  const json=(body:unknown,status=200)=>apiJson(request,body,status);
  if(!allowedApiOrigin(request))return json({error:"Недопустимый источник запроса."},403);
  const langValue=request.headers.get("X-EasyPlast-Language"),lang:Language=isLanguage(langValue)?langValue:"ru";
  const t=(text:string)=>translate(text,lang);
  const user = await getSiteUser(request);
  if (!user) return json({error:t('Для оформления заявки войдите в аккаунт.')},401);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({error:t('Ожидаются данные JSON.')},415);
  let body: unknown;
  try { const raw = await request.text(); if(raw.length > 64000) return json({error:t('Слишком большая заявка.')},413); body=JSON.parse(raw); }
  catch { return json({error:t('Проверьте данные заявки.')},400); }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return json({error:t(parsed.error.issues[0]?.code === "custom" ? parsed.error.issues[0].message : "Проверьте параметры заявки.")},400);
  try {
    const db = env.DB;
    if (!db) throw new Error("DB unavailable");
    const {requestKey, delivery:d} = parsed.data;
    const items=parsed.data.items.map(item=>({...item,name:([...products,customProduct].find(p=>p.key===item.category) ?? customProduct).name,unitPrice:getUnitPrice(item.category),lineTotal:itemCost(item)}));
    const existing = await db.prepare("SELECT * FROM orders WHERE user_id = ? AND request_key = ?").bind(user.userId,requestKey).first();
    if (existing) return json({order:publicOrder(existing)});
    const count = await db.prepare("SELECT COUNT(*) AS total FROM orders WHERE user_id = ? AND created_at > ?").bind(user.userId,Date.now()-3600000).first<{total:number}>();
    if (count && count.total >= 20) return json({error:t('Слишком много заявок за час. Свяжитесь с нами по телефону или в Telegram.')},429);
    const id=crypto.randomUUID(), number=`EP-${id.slice(0,8).toUpperCase()}`, createdAt=Date.now();
    const result = await db.prepare("INSERT INTO orders (id,user_id,request_key,number,name,phone,method,city,address,latitude,longitude,comment,requested_date,items_json,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,request_key) DO NOTHING").bind(id,user.userId,requestKey,number,d.name,d.phone,d.method,d.city,d.method === "delivery" ? d.address : "",d.method === "delivery" ? d.latitude : null,d.method === "delivery" ? d.longitude : null,d.comment,d.requestedDate || null,JSON.stringify(items),"pending",createdAt).run();
    if (result.meta.changes === 0) {
      const duplicate = await db.prepare("SELECT * FROM orders WHERE user_id = ? AND request_key = ?").bind(user.userId,requestKey).first();
      if(duplicate) return json({order:publicOrder(duplicate)});
      throw new Error("Insert unsuccessful");
    }
    return json({order:{id,number,createdAt,status:"pending",items,delivery:{...d,address:d.method === "delivery" ? d.address : "",latitude:d.method === "delivery" ? d.latitude : null,longitude:d.method === "delivery" ? d.longitude : null}}},201);
  } catch { return json({error:t('Не удалось сохранить заявку. Параметры сохранены в браузере — попробуйте ещё раз.')},503); }
}
