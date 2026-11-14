import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

registerHooks({resolve(specifier,ctx,next) {
  if (specifier.startsWith('.') && ctx.parentURL?.startsWith('file:') && existsSync(fileURLToPath(new URL(specifier+'.ts',ctx.parentURL)))) return next(specifier+'.ts',ctx);
  return next(specifier,ctx);
}});
const {guestOrders} = await import('./guest-orders.js');
const origin='https://easyplast.saidkhujalucky.workers.dev', path=origin+'/api/guest-orders';
function fixture() {
  const sql=new DatabaseSync(':memory:');
  for(const file of ['../backend/drizzle/0000_goofy_namorita.sql','./migrations/0001_guest_checkout.sql']) sql.exec(readFileSync(new URL(file,import.meta.url),'utf8'));
  const db={prepare(query) {const stmt=sql.prepare(query);let args=[];return {
    bind(...params){args=params;return this;},
    async first(column){const row=stmt.get(...args);return column?row?.[column]??null:row??null;},
    async run(){return {meta:{changes:stmt.run(...args).changes}};}
  };}};
  const send=(data,ip='192.0.2.1')=>guestOrders(new Request(path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':ip},body:JSON.stringify(data)}),{SITE_DB:db});
  return {sql,send};
}
function order() {
  return {requestKey:crypto.randomUUID(),delivery:{name:'Guest test',phone:'990000000',method:'pickup',city:'Ташкент',address:'',latitude:null,longitude:null,comment:'',requestedDate:''},
    items:[{id:crypto.randomUUID(),category:'broccoli',name:'wrong',width:40,length:50,thickness:15,color:'#2b5de0',colorName:'wrong',quantity:50,unitPrice:1}]};
}
test('only the public sites can submit; receipt endpoint has no read method',async()=>{
  assert.equal((await guestOrders(new Request(path,{method:'OPTIONS',headers:{Origin:origin}}),{})).status,204);
  assert.equal((await guestOrders(new Request(path,{method:'OPTIONS',headers:{Origin:'https://saidkhujalucky-hub.github.io','Access-Control-Request-Method':'POST'}}),{})).headers.get('Access-Control-Allow-Origin'),'https://saidkhujalucky-hub.github.io');
  assert.equal((await guestOrders(new Request(path,{method:'OPTIONS',headers:{Origin:'https://another.example'}}),{})).status,403);
  assert.equal((await guestOrders(new Request(path),{})).status,405);
  assert.equal((await guestOrders(new Request(path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),{})).status,400);
});
test('normalizes and prices the order, returns a minimal receipt and preserves retries',async()=>{
  const {sql,send}=fixture(), data=order();
  const replies=await Promise.all([send(data),send(data,'192.0.2.2')]);
  assert.deepEqual(replies.map(r=>r.status).sort(),[200,201]);
  const [saved,again]=await Promise.all(replies.map(r=>r.json()));
  assert.deepEqual(saved,again);assert.deepEqual(Object.keys(saved.order).sort(),['createdAt','id','number','status']);
  const row=sql.prepare('SELECT * FROM orders').get();
  assert.equal(row.phone,'+998990000000');assert.match(row.user_id,/^guest:[0-9a-f]{64}$/);
  const [item]=JSON.parse(row.items_json);assert.equal(item.lineTotal,1450000);assert.equal(item.name,'Для брокколи');assert.equal(item.colorName,'Синий');
  const mismatch=await send({...data,delivery:{...data.delivery,name:'Changed'}});
  assert.equal(mismatch.status,409);assert.deepEqual(await mismatch.json(),{errorCode:'request_key_conflict'});
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM orders').get().n,1);
});
test('hourly guest limit survives simultaneous submissions and permits exact retries',async()=>{
  const {send}=fixture(), data=order();assert.equal((await send(data)).status,201);
  const rest=await Promise.all(Array.from({length:20},()=>send(order())));
  assert.equal(rest.filter(r=>r.status===429).length,1);
  assert.equal((await send(data)).status,200);assert.equal((await send(order(),'192.0.2.2')).status,201);
});
