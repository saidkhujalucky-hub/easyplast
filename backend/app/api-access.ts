import {env} from "cloudflare:workers";
export function crossOrigin(request?:Request) {
  const origin=request?.headers.get("origin");
  return !!origin && origin!==new URL(request!.url).origin;
}
export function allowedApiOrigin(request?:Request) {
  if(!request || !crossOrigin(request))return true;
  const origin=request.headers.get("origin")!;
  return (env.API_ALLOWED_ORIGINS||"").split(",").map(value=>value.trim()).filter(Boolean).includes(origin);
}
export function apiHeaders(request?:Request, extra?:HeadersInit) {
  const headers=new Headers(extra);
  headers.set("Cache-Control","no-store");headers.set("Vary","Origin");
  if(request&&crossOrigin(request)&&allowedApiOrigin(request))headers.set("Access-Control-Allow-Origin",request.headers.get("origin")!);
  return headers;
}
export function apiJson(request:Request|undefined,body:unknown,status=200,extra?:HeadersInit) {
  return Response.json(body,{status,headers:apiHeaders(request,extra)});
}
export function preflight(request:Request) {
  if(!allowedApiOrigin(request))return apiJson(request,{error:"Недопустимый источник запроса."},403);
  const method=request.headers.get("Access-Control-Request-Method");
  const requestedHeaders=(request.headers.get("Access-Control-Request-Headers")||"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  if((method&&!['GET','POST'].includes(method))||requestedHeaders.some(value=>!['authorization','content-type','x-easyplast-language'].includes(value)))return apiJson(request,{error:"Недопустимый запрос."},403);
  return new Response(null,{status:204,headers:apiHeaders(request,{
    "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":"Authorization, Content-Type, X-EasyPlast-Language",
    "Access-Control-Max-Age":"600",
  })});
}
