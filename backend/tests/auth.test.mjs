import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,exportJWK,createLocalJWKSet,SignJWT} from 'jose';
import {verifyGoogleToken} from '../app/verify-google.ts';
import {orderSchema} from '../app/order-validation.ts';

const pair=await generateKeyPair('RS256');
const jwk=await exportJWK(pair.publicKey);jwk.kid='test-key';jwk.alg='RS256';
const keys=createLocalJWKSet({keys:[jwk]});
const audience='test-client.apps.googleusercontent.com',nonce='test-nonce';
async function token(overrides={}) {
  const now=Math.floor(Date.now()/1000);
  return new SignJWT({sub:'123456789',email:'test@example.invalid',name:'Test Customer',email_verified:true,nonce,iss:'https://accounts.google.com',aud:audience,iat:now,exp:now+3600,...overrides}).setProtectedHeader({alg:'RS256',kid:'test-key'}).sign(pair.privateKey);
}
test('accepts a signed Google identity bound to this client and nonce',async()=>{
  const result=await verifyGoogleToken(await token(),audience,nonce,keys);
  assert.equal(result.userId,'google:123456789');assert.equal(result.email,'test@example.invalid');
});
for(const [name,overrides] of Object.entries({
  'wrong audience':{aud:'another-client'},'wrong issuer':{iss:'https://attacker.invalid'},
  'wrong nonce':{nonce:'other-nonce'},'unverified email':{email_verified:false},
  'expired token':{exp:Math.floor(Date.now()/1000)-120},'wrong authorized party':{azp:'another-client'},
  'missing nonce':{nonce:undefined},'missing expiration':{exp:undefined},
}))test(`rejects ${name}`,async()=>{await assert.rejects(verifyGoogleToken(await token(overrides),audience,nonce,keys));});
test('rejects tokens whose signature was modified',async()=>{
  const valid=await token();const parts=valid.split('.');parts[2]=(parts[2][0]==='A'?'B':'A')+parts[2].slice(1);
  await assert.rejects(verifyGoogleToken(parts.join('.'),audience,nonce,keys));
});
const validOrder={requestKey:'a069c19f-1ca5-4b5b-8a1d-6fa4b0579faa',items:[{id:'9955beb5-9817-4ebc-a3df-9692f940a18d',category:'water',name:'Для воды',width:48,length:70,thickness:50,color:'#2B5DE0',colorName:'Синий',quantity:100}],delivery:{name:'Test Customer',phone:'990000000',method:'delivery',city:'Ташкент',address:'Тестовый адрес, дом 1',latitude:null,longitude:null,comment:'',requestedDate:''}};
test('normalizes local phone numbers and accepts configured dimensions',()=>{
  const result=orderSchema.parse(validOrder);assert.equal(result.delivery.phone,'+998990000000');assert.equal(result.items[0].width,48);
});
test('rejects an empty delivery address and an empty order',()=>{
  assert.equal(orderSchema.safeParse({...validOrder,delivery:{...validOrder.delivery,address:''}}).success,false);
  assert.equal(orderSchema.safeParse({...validOrder,items:[]}).success,false);
});
test('permits pickup without a street address',()=>{assert.equal(orderSchema.safeParse({...validOrder,delivery:{...validOrder.delivery,method:'pickup',address:''}}).success,true);});
test('rejects invalid physical dimensions, colors and incomplete coordinates',()=>{
  for(const item of [{width:0},{length:-1},{thickness:0},{quantity:0},{color:'javascript:alert(1)'}])assert.equal(orderSchema.safeParse({...validOrder,items:[{...validOrder.items[0],...item}]}).success,false);
  assert.equal(orderSchema.safeParse({...validOrder,delivery:{...validOrder.delivery,latitude:41,longitude:null}}).success,false);
});
