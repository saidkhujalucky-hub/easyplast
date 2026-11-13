import {GET as authConfig} from "../app/api/auth/config/route";
import {POST as googleLogin} from "../app/api/auth/google/route";
import {GET as session} from "../app/api/auth/session/route";
import {POST as logout} from "../app/api/auth/logout/route";
import {GET as listOrders,POST as createOrder} from "../app/api/orders/route";
import {preflight,apiJson} from "../app/api-access";
export default {async fetch(request:Request){
 try{
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return preflight(request);
  const key=request.method+" "+url.pathname;
  switch(key){
   case "GET /api/auth/config":return await authConfig(request);
   case "POST /api/auth/google":return await googleLogin(request);
   case "GET /api/auth/session":return await session(request);
   case "POST /api/auth/logout":return await logout(request);
   case "GET /api/orders":return await listOrders(request);
   case "POST /api/orders":return await createOrder(request);
   default:return apiJson(request,{error:"Маршрут не найден."},404);
  }
 }catch{return apiJson(request,{error:"Сервер временно недоступен. Попробуйте ещё раз."},503);}
}};
