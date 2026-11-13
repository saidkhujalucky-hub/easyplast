import {getSiteUser} from "../../../auth";
import {allowedApiOrigin,apiJson,preflight} from "../../../api-access";
export const dynamic="force-dynamic";
export const OPTIONS=preflight;
export async function GET(request:Request) {
  if(!allowedApiOrigin(request))return apiJson(request,{error:"Недопустимый источник запроса."},403);
  const user=await getSiteUser(request);
  return user ? apiJson(request,{user:{displayName:user.displayName,email:user.email}}) : apiJson(request,{error:"Войдите в аккаунт."},401);
}
