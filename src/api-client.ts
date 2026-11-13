"use client";
declare global {interface Window {EASY_PLAST_API_BASE?:string;}}
const SESSION_KEY="ep-google-session-v1";
export function externalApi() {
  if(typeof window==="undefined"||!window.EASY_PLAST_API_BASE)return "";
  try {
    const url=new URL(window.EASY_PLAST_API_BASE);
    if(url.protocol!=="https:"||url.username||url.password)return "";
    return url.origin===window.location.origin?"":url.origin;
  }catch{return "";}
}
export function storedApiSession() {
  if(!externalApi())return null;
  try {
    const session=JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");
    if(session&&/^[0-9a-f]{64}$/.test(session.token)&&session.expiresAt>Date.now())return session as {token:string;expiresAt:number};
    sessionStorage.removeItem(SESSION_KEY);
  }catch{}
  return null;
}
export function rememberApiSession(token:string,expiresAt:number) {
  if(!/^[0-9a-f]{64}$/.test(token)||!Number.isFinite(expiresAt)||expiresAt<=Date.now())throw new Error("Invalid session");
  sessionStorage.setItem(SESSION_KEY,JSON.stringify({token,expiresAt}));
}
export function clearApiSession() {try{sessionStorage.removeItem(SESSION_KEY);}catch{}}
export async function apiFetch(path:string,options:RequestInit={}) {
  if(!/^\/api\//.test(path))throw new Error("Invalid API path");
  if(!window.EASY_PLAST_API_BASE){return Response.json(path==="/api/auth/config"?{configured:false}:{error:"Подключите сервер для сохранения заявок."},{status:path==="/api/auth/config"?200:503});}
  const base=externalApi(),headers=new Headers(options.headers),session=storedApiSession();
  if(base&&session)headers.set("Authorization",`Bearer ${session.token}`);
  const response=await fetch(`${base}${path}`,{...options,headers,credentials:base?"omit":"same-origin",cache:"no-store"});
  if(base&&response.status===401)clearApiSession();
  return response;
}
