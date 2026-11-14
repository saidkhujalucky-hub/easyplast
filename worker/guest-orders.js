import { orderSchema } from '../backend/app/order-validation.ts';
import { products, customProduct, colors, getUnitPrice, itemCost } from '../backend/app/catalog.ts';
import { isLanguage, translate } from '../backend/app/messages.ts';

const origins = new Set(['https://easyplast.saidkhujalucky.workers.dev', 'https://saidkhujalucky-hub.github.io']);
const limit = 20;
const encoder = new TextEncoder();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
  return value;
}

async function guestUser(db, ip) {
  const secret = await db.prepare('SELECT ip_key FROM guest_checkout_settings WHERE id=1').first('ip_key');
  const key = await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return 'guest:' + hex(await crypto.subtle.sign('HMAC',key,encoder.encode(ip)));
}

async function parseBody(request) {
  if (!request.body) return null;
  const reader = request.body.getReader(), decoder = new TextDecoder();
  let length = 0, text = '';
  for (;;) {
    const {value,done} = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 64000) {await reader.cancel(); throw new RangeError();}
    text += decoder.decode(value,{stream:true});
  }
  return JSON.parse(text + decoder.decode());
}

export async function guestOrders(request, env) {
  const origin = request.headers.get('Origin');
  const headers = new Headers({'Cache-Control':'no-store','Vary':'Origin','Allow':'POST, OPTIONS'});
  const json = (body,status) => Response.json(body,{status,headers});
  const lang = request.headers.get('X-EasyPlast-Language');
  const fail = (message,status) => json({error:translate(message,isLanguage(lang) ? lang : 'ru')},status);
  if (request.method !== 'POST' && request.method !== 'OPTIONS') return fail('Недопустимый запрос.',405);
  if (!origins.has(origin)) return fail('Недопустимый источник запроса.',403);
  headers.set('Access-Control-Allow-Origin',origin);
  if (request.method === 'OPTIONS') {
    const method = request.headers.get('Access-Control-Request-Method');
    const names = (request.headers.get('Access-Control-Request-Headers') || '').toLowerCase().split(',').map(k=>k.trim()).filter(Boolean);
    if ((method && method !== 'POST') || names.some(k=>!['content-type','x-easyplast-language'].includes(k))) return fail('Недопустимый запрос.',403);
    headers.set('Access-Control-Allow-Methods','POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers','Content-Type, X-EasyPlast-Language');
    headers.set('Access-Control-Max-Age','600');
    return new Response(null,{status:204,headers});
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail('Ожидаются данные JSON.',415);
  let body, digest;
  try {
    body = await parseBody(request);
    if (!body || !uuid.test(body.requestKey)) return fail('Проверьте параметры заявки.',400);
    digest = hex(await crypto.subtle.digest('SHA-256',encoder.encode(JSON.stringify(canonical(body)))));
  } catch (error) {return error instanceof RangeError ? fail('Слишком большая заявка.',413) : fail('Проверьте данные заявки.',400);}
  const db = env.SITE_DB;
  const requestKey = body.requestKey.toLowerCase();
  const existing = () => db.prepare('SELECT id,number,created_at,guest_payload_hash FROM orders WHERE request_key=? AND guest_payload_hash IS NOT NULL').bind(requestKey).first();
  const receipt = (row,status) => json({order:{id:row.id,number:row.number,createdAt:row.created_at,status:'pending'}},status);
  const replay = row => row.guest_payload_hash === digest ? receipt(row,200) : json({errorCode:'request_key_conflict'},409);
  try {
    const prior = await existing();
    if (prior) return replay(prior);
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.code === 'custom' ? parsed.error.issues[0].message : 'Проверьте параметры заявки.',400);
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip) throw new Error('Missing client address');
    const userId = await guestUser(db,ip);
    const {items,delivery:d} = parsed.data;
    const priced = items.map(item => ({
      ...item,name:([...products,customProduct].find(p=>p.key===item.category)).name,
      colorName:colors.find(c=>c.value===item.color.toUpperCase())?.name || item.color.toUpperCase(),
      unitPrice:getUnitPrice(item.category),lineTotal:itemCost(item)
    }));
    const id = crypto.randomUUID(), createdAt = Date.now(), number = 'EP-' + id.slice(0,8).toUpperCase();
    const delivery = d.method === 'delivery';
    const inserted = await db.prepare(`INSERT INTO orders
      (id,user_id,request_key,number,name,phone,method,city,address,latitude,longitude,comment,requested_date,items_json,status,created_at,guest_payload_hash)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      WHERE (SELECT COUNT(*) FROM orders WHERE user_id=? AND created_at>?) < ?
      ON CONFLICT DO NOTHING`).bind(id,userId,requestKey,number,d.name,d.phone,d.method,d.city,delivery?d.address:'',delivery?d.latitude:null,delivery?d.longitude:null,d.comment,d.requestedDate||null,JSON.stringify(priced),'pending',createdAt,digest,userId,createdAt-3600000,limit).run();
    if (inserted.meta.changes) return receipt({id,number,created_at:createdAt},201);
    const duplicate = await existing();
    if (duplicate) return replay(duplicate);
    return fail('Слишком много заявок за час. Свяжитесь с нами по телефону или в Telegram.',429);
  } catch { return fail('Не удалось сохранить заявку. Параметры сохранены в браузере — попробуйте ещё раз.',503); }
}
