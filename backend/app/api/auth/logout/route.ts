import { env } from "cloudflare:workers";
import { cookie, readCookie, SESSION_COOKIE, tokenHash, bearerToken } from "../../../auth";
import {allowedApiOrigin,apiJson,crossOrigin,preflight} from "../../../api-access";
export const OPTIONS=preflight;
export async function POST(request:Request) {
  if(!request.headers.get("origin")||!allowedApiOrigin(request))return apiJson(request,{error:"Недопустимый источник запроса."},403);
  const web=crossOrigin(request),session=web?bearerToken(request):readCookie(request,SESSION_COOKIE);
  if(session&&env.DB)await env.DB.prepare("DELETE FROM sessions WHERE hash=?").bind(await tokenHash(session)).run();
  return apiJson(request,{ok:true},200,web?undefined:{"Set-Cookie":cookie(SESSION_COOKIE,"",0)});
}
