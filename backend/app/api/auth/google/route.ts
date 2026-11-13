import { env } from "cloudflare:workers";
import { verifyGoogleToken } from "../../../verify-google";
import { randomToken, tokenHash, SESSION_COOKIE, NONCE_COOKIE, SESSION_AGE, WEB_SESSION_AGE, cookie, readCookie, bearerToken } from "../../../auth";
import {allowedApiOrigin,apiJson,crossOrigin,preflight} from "../../../api-access";

export const dynamic="force-dynamic";
export const OPTIONS=preflight;
export async function POST(request:Request) {
  const error=(message:string,status:number)=>apiJson(request,{error:message},status);
  if(!request.headers.get("origin")||!allowedApiOrigin(request))return error("Недопустимый источник запроса.",403);
  if(!env.GOOGLE_CLIENT_ID)return error("Вход Google ещё не подключён. Свяжитесь с Easy Plast по телефону или в Telegram.",503);
  if(!env.DB)return error("Вход временно недоступен. Попробуйте ещё раз.",503);
  if(!request.headers.get("content-type")?.includes("application/json"))return error("Ожидаются данные JSON.",415);
  let credential:string,nonce:string;
  try {
    const raw=await request.text();if(raw.length>16000)return error("Слишком большой запрос.",413);
    const body=JSON.parse(raw);credential=body.credential;nonce=body.nonce;
    if(typeof credential!=="string"||typeof nonce!=="string")throw new Error();
  }catch{return error("Не удалось проверить вход Google.",400);}
  if(!/^[0-9a-f]{64}$/.test(nonce))return error("Сеанс входа истёк. Откройте окно входа ещё раз.",403);
  const web=crossOrigin(request),origin=request.headers.get("origin")!,nonceHash=await tokenHash(nonce);
  try {
    if(web){
      const challenge=await env.DB.prepare("SELECT hash FROM login_challenges WHERE hash=? AND origin=? AND expires_at>?").bind(nonceHash,origin,Date.now()).first();
      if(!challenge)return error("Сеанс входа истёк. Откройте окно входа ещё раз.",403);
    }else if(readCookie(request,NONCE_COOKIE)!==nonce)return error("Сеанс входа истёк. Откройте окно входа ещё раз.",403);
  }catch{return error("Вход временно недоступен. Попробуйте ещё раз.",503);}
  let identity;
  try {identity=await verifyGoogleToken(credential,env.GOOGLE_CLIENT_ID,nonce);}
  catch{return error("Google не подтвердил вход. Попробуйте ещё раз.",401);}
  try {
    if(web){
      const consumed=await env.DB.prepare("DELETE FROM login_challenges WHERE hash=? AND origin=? AND expires_at>? RETURNING hash").bind(nonceHash,origin,Date.now()).first();
      if(!consumed)return error("Сеанс входа истёк. Откройте окно входа ещё раз.",403);
    }
    const {userId,email,displayName}=identity;
    const session=randomToken(),now=Date.now(),age=web?WEB_SESSION_AGE:SESSION_AGE,expiresAt=now+age*1000;
    const oldSession=web?bearerToken(request):readCookie(request,SESSION_COOKIE);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO users (id,email,display_name,created_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,display_name=excluded.display_name").bind(userId,email,displayName,now),
      env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
      env.DB.prepare("DELETE FROM sessions WHERE hash=?").bind(oldSession?await tokenHash(oldSession):""),
      env.DB.prepare("INSERT INTO sessions (hash,user_id,expires_at) VALUES (?,?,?)").bind(await tokenHash(session),userId,expiresAt),
    ]);
    if(web)return apiJson(request,{user:{displayName,email},sessionToken:session,expiresAt});
    const headers=new Headers();headers.append("Set-Cookie",cookie(SESSION_COOKIE,session,age));headers.append("Set-Cookie",cookie(NONCE_COOKIE,"",0));
    return apiJson(request,{user:{displayName,email}},200,headers);
  }catch{return error("Не удалось создать сеанс. Попробуйте ещё раз.",503);}
}
