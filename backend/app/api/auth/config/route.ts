import { env } from "cloudflare:workers";
import { randomToken, tokenHash, NONCE_COOKIE, cookie } from "../../../auth";
import {allowedApiOrigin,apiJson,crossOrigin,preflight} from "../../../api-access";
export const dynamic = "force-dynamic";
export const OPTIONS=preflight;
export async function GET(request?:Request) {
  if(!allowedApiOrigin(request))return apiJson(request,{error:"Недопустимый источник запроса."},403);
  const clientId=env.GOOGLE_CLIENT_ID;
  if(!clientId)return apiJson(request,{configured:false});
  const nonce=randomToken();
  if(crossOrigin(request)){
    if(!env.DB)return apiJson(request,{error:"Вход временно недоступен. Попробуйте ещё раз."},503);
    const now=Date.now();
    await env.DB.prepare("DELETE FROM login_challenges WHERE expires_at<=?").bind(now).run();
    await env.DB.prepare("INSERT INTO login_challenges (hash,origin,expires_at) VALUES (?,?,?)").bind(await tokenHash(nonce),request!.headers.get("origin"),now+600000).run();
    return apiJson(request,{configured:true,clientId,nonce});
  }
  return apiJson(request,{configured:true,clientId,nonce},200,{"Set-Cookie":cookie(NONCE_COOKIE,nonce,600)});
}
