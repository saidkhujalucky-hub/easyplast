import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
const googleKeys=createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
export async function verifyGoogleToken(credential:string,audience:string,nonce:string,keys:JWTVerifyGetKey=googleKeys) {
  const {payload}=await jwtVerify(credential,keys,{audience,issuer:["https://accounts.google.com","accounts.google.com"],algorithms:["RS256"],maxTokenAge:"10m",clockTolerance:10,requiredClaims:["sub","email","email_verified","iat","exp","nonce"]});
  if(payload.nonce!==nonce || payload.email_verified!==true || typeof payload.sub!=="string" || !/^[0-9]{1,255}$/.test(payload.sub) || typeof payload.email!=="string" || (payload.azp && payload.azp!==audience)) throw new Error("Invalid Google identity");
  return {userId:`google:${payload.sub}`,email:payload.email.slice(0,320),displayName:typeof payload.name==="string" ? payload.name.slice(0,120) : payload.email.slice(0,320)};
}
