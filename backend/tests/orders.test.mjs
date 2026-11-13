import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash,randomBytes,randomUUID} from 'node:crypto';

const sqlite=new DatabaseSync(':memory:');
sqlite.exec(readFileSync(new URL('../drizzle/0000_goofy_namorita.sql',import.meta.url),'utf8'));
sqlite.exec(readFileSync(new URL('../drizzle/0001_youthful_menace.sql',import.meta.url),'utf8'));
const db={prepare(sql){let args=[];const p={bind(...values){args=values;return p;},async first(){return sqlite.prepare(sql).get(...args)??null;},async all(){return {results:sqlite.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}};}};return p;}};
globalThis.__epTestEnv={DB:db};globalThis.__epTestCookies={};
registerHooks({resolve(specifier,context,next){
  if(specifier==='cloudflare:workers')return {url:'data:text/javascript,export const env=globalThis.__epTestEnv;',shortCircuit:true};
  if(specifier==='next/headers')return {url:'data:text/javascript,export const cookies=async()=>({get:(name)=>globalThis.__epTestCookies[name]?{value:globalThis.__epTestCookies[name]}:undefined});',shortCircuit:true};
  if(specifier.startsWith('.')&&context.parentURL?.startsWith('file:')){const url=new URL(specifier,context.parentURL);if(existsSync(fileURLToPath(url)+'.ts'))return next(specifier+'.ts',context);}
  return next(specifier,context);
}});
const {GET:rawGET,POST}=await import('../app/api/orders/route.ts');
const cookieHeader=()=>Object.entries(globalThis.__epTestCookies).map(([name,value])=>name+'='+value).join('; ');
const GET=()=>rawGET(new Request('https://easy-plast.test/api/orders',{headers:{Cookie:cookieHeader()}}));
const {GET:config}=await import('../app/api/auth/config/route.ts');
const {POST:google}=await import('../app/api/auth/google/route.ts');
const {POST:logout}=await import('../app/api/auth/logout/route.ts');
const origin='https://easy-plast.test';
function session(userId,expired=false){const token=randomBytes(32).toString('hex');sqlite.prepare('INSERT OR IGNORE INTO users (id,email,display_name,created_at) VALUES (?,?,?,?)').run(userId,`${userId}@example.invalid`,userId,Date.now());sqlite.prepare('INSERT INTO sessions (hash,user_id,expires_at) VALUES (?,?,?)').run(createHash('sha256').update(token).digest('hex'),userId,Date.now()+(expired?-1000:3600000));return token;}
const alice=session('alice'),bob=session('bob'),expired=session('expired',true);
function as(token){globalThis.__epTestCookies=token?{'__Host-ep_session':token}:{};}
function order(){return {requestKey:randomUUID(),items:[{id:randomUUID(),category:'water',name:'Для воды',width:48,length:70,thickness:50,color:'#2B5DE0',colorName:'Синий',quantity:100}],delivery:{name:'Test Customer',phone:'990000000',method:'delivery',city:'Ташкент',address:'Тестовый адрес, дом 1',latitude:41.3,longitude:69.2,comment:'QA fixture',requestedDate:''}};}
function request(body,requestOrigin=origin){return new Request(`${origin}/api/orders`,{method:'POST',headers:{'Content-Type':'application/json','Origin':requestOrigin,'Cookie':cookieHeader()},body:JSON.stringify(body)});}

test('Google setup reports unavailable until an actual client ID is configured',async()=>{const r=await config();assert.deepEqual(await r.json(),{configured:false});});
test('anonymous, forged and expired sessions cannot read or create orders',async()=>{
  for(const token of [null,'f'.repeat(64),expired]){as(token);assert.equal((await GET()).status,401);assert.equal((await POST(request(order()))).status,401);}
});
test('authenticated order stores dimensions and address, and retry is idempotent',async()=>{
  as(alice);const input=order();const first=await POST(request(input));assert.equal(first.status,201);const saved=(await first.json()).order;
  assert.equal(saved.items[0].width,48);assert.equal(saved.delivery.latitude,41.3);assert.equal(saved.delivery.phone,'+998990000000');
  const retry=await POST(request(input));assert.equal((await retry.json()).order.id,saved.id);
  const list=(await (await GET()).json()).orders;assert.equal(list.length,1);assert.equal(list[0].id,saved.id);assert.equal(list[0].delivery.address,input.delivery.address);
});
test('a second customer cannot see the first customer\'s orders',async()=>{as(bob);assert.deepEqual((await (await GET()).json()).orders,[]);});
test('rejects cross-origin writes and invalid order data',async()=>{as(alice);assert.equal((await POST(request(order(),'https://attacker.invalid'))).status,403);const input=order();input.items[0].width=0;assert.equal((await POST(request(input))).status,400);});
test('Google login and logout reject cross-origin requests',async()=>{
  const bad=new Request(`${origin}/api/auth/google`,{method:'POST',headers:{Origin:'https://attacker.invalid'},body:'{}'});
  assert.equal((await google(bad)).status,403);
  const badLogout=new Request(`${origin}/api/auth/logout`,{method:'POST',headers:{Origin:'https://attacker.invalid'}});
  assert.equal((await logout(badLogout)).status,403);
});
test('logout revokes the session on the server',async()=>{as(bob);const r=await logout(new Request(`${origin}/api/auth/logout`,{method:'POST',headers:{Origin:origin,Cookie:`__Host-ep_session=${bob}`}}));assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);assert.equal((await GET()).status,401);});

test('server enforces the 20 kg total minimum, including mixed orders',async()=>{
  as(alice);const input=order();input.items[0].quantity=19;
  assert.equal((await POST(request(input))).status,400);
  input.items[0].quantity=20;assert.equal((await POST(request(input))).status,201);
  const mixed=order();mixed.items[0].quantity=10;mixed.items.push({...mixed.items[0],id:randomUUID(),category:'carpets',name:'Для ковров'});
  assert.equal((await POST(request(mixed))).status,201);
});
test('server prices all categories using the tariff, ignoring a supplied price',async()=>{
  as(alice);
  for(const [category,rate] of Object.entries({water:26000,cookies:26000,broccoli:29000,carpets:25000,tshirt:26000,trash:26000,custom:26000})){
    const input=order();Object.assign(input.items[0],{category,quantity:20,unitPrice:1,lineTotal:1,purpose:category==='custom'?'Для упаковки одежды':''});
    const response=await POST(request(input));assert.equal(response.status,201);const saved=(await response.json()).order.items[0];
    assert.equal(saved.unitPrice,rate,category);assert.equal(saved.lineTotal,rate*20,category);
    if(category==='custom')assert.equal(saved.purpose,'Для упаковки одежды');
  }
});
test('custom packaging requires an intended use and keeps it after loading',async()=>{
  as(alice);const input=order();input.items[0].category='custom';
  assert.equal((await POST(request(input))).status,400);
  input.items[0].purpose='Для хлеба';const response=await POST(request(input));assert.equal(response.status,201);const saved=(await response.json()).order;
  const list=(await (await GET()).json()).orders;const loaded=list.find(o=>o.id===saved.id);assert.equal(loaded.items[0].purpose,'Для хлеба');assert.equal(loaded.items[0].lineTotal,2600000);
});
test('minimum-order errors are returned in the selected language',async()=>{
  as(alice);const input=order();input.items[0].quantity=19;
  for(const [lang,expected] of Object.entries({en:'Minimum order — 20 kg',uz:'Minimal buyurtma — 20 kg'})){
    const req=new Request(`${origin}/api/orders`,{method:'POST',headers:{'Content-Type':'application/json','Origin':origin,'Cookie':cookieHeader(),'X-EasyPlast-Language':lang},body:JSON.stringify(input)});
    const res=await POST(req);assert.equal(res.status,400);assert.equal((await res.json()).error,expected);
  }
});

test('Telegram messages include intended use, correct prices and the selected language',async()=>{
  const {orderText}=await import('../app/catalog.ts');
  const sample={id:'test',number:'EP-TEST',createdAt:Date.now(),status:'pending',items:[{...order().items[0],category:'custom',name:'Свой вариант',purpose:'Kiyim uchun',quantity:20,unitPrice:26000,lineTotal:520000}],delivery:order().delivery};
  const en=orderText(sample,'en');assert.match(en,/Custom packaging/);assert.match(en,/Kiyim uchun/);assert.match(en,/520,000 UZS/);assert.match(en,/Delivery:/);assert.doesNotMatch(en,/Цена|Назначение|Стоимость/);
  const uz=orderText(sample,'uz');assert.match(uz,/Oʻz variantim/);assert.match(uz,/Qoʻllanishi/);assert.match(uz,/soʻm/);
  const ru=orderText(sample,'ru');assert.match(ru,/Назначение/);assert.match(ru,/сум/);
});

test('carpet orders save width and 5 micron thickness without a length',async()=>{
  as(alice);
  const input=order();
  Object.assign(input.items[0],{category:'carpets',name:'Для ковров',width:50,thickness:5,quantity:20});
  delete input.items[0].length;
  const response=await POST(request(input));assert.equal(response.status,201);
  const saved=(await response.json()).order;
  assert.equal(saved.items[0].width,50);assert.equal(saved.items[0].thickness,5);
  assert.equal(saved.items[0].lineTotal,500000);assert.equal('length' in saved.items[0],false);
  const loaded=(await (await GET()).json()).orders.find(o=>o.id===saved.id);
  assert.equal('length' in loaded.items[0],false);
  const {orderText}=await import('../app/catalog.ts');
  for(const lang of ['ru','uz','en']){
    const text=orderText(saved,lang);
    assert.doesNotMatch(text,/×|undefined|NaN/);
    assert.match(text,/50/);
  }
});

test('legacy carpet lengths are removed while other bags still require length',async()=>{
  const {itemSchema}=await import('../app/order-validation.ts');
  const legacy={...order().items[0],category:'carpets',length:137};
  const normalized=itemSchema.parse(legacy);assert.equal('length' in normalized,false);
  const bag={...order().items[0],thickness:5};delete bag.length;
  assert.equal(itemSchema.safeParse(bag).success,false);
});


test('external origins require allowlisting and a bearer session',async()=>{
  const allowed='https://frontend.example';globalThis.__epTestEnv.API_ALLOWED_ORIGINS=allowed;
  const {preflight}=await import('../app/api-access.ts');
  const pre=preflight(new Request(origin+'/api/orders',{method:'OPTIONS',headers:{Origin:allowed,'Access-Control-Request-Method':'GET','Access-Control-Request-Headers':'authorization,x-easyplast-language'}}));
  assert.equal(pre.status,204);assert.equal(pre.headers.get('Access-Control-Allow-Origin'),allowed);
  const bearer=await rawGET(new Request(origin+'/api/orders',{headers:{Origin:allowed,Authorization:'Bearer '+alice}}));assert.equal(bearer.status,200);
  const cookiesOnly=await rawGET(new Request(origin+'/api/orders',{headers:{Origin:allowed,Cookie:'__Host-ep_session='+alice}}));assert.equal(cookiesOnly.status,401);
  const denied=await rawGET(new Request(origin+'/api/orders',{headers:{Origin:'https://blocked.example',Authorization:'Bearer '+alice}}));assert.equal(denied.status,403);
  delete globalThis.__epTestEnv.API_ALLOWED_ORIGINS;
});
