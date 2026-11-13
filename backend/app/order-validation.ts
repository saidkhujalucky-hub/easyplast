import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().uuid(), category: z.enum(["water", "cookies", "broccoli", "carpets", "tshirt", "trash", "custom"]),
  name: z.string().trim().min(1).max(80), width: z.number().finite().min(1).max(1000), length: z.number().finite().min(1).max(5000).optional(),
  thickness: z.number().finite().min(5).max(1000), color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  colorName: z.string().trim().min(1).max(80), quantity: z.number().finite().min(1).max(1000000),
  purpose: z.string().trim().max(200).optional().default(""),
}).superRefine((item,ctx)=>{
  if(item.category!=="carpets" && item.length===undefined)ctx.addIssue({code:"custom",path:["length"],message:"Укажите длину пакета"});
}).transform(item=>{
  const normalized={...item};
  if(normalized.category==="carpets")delete normalized.length;
  return normalized;
});
export const deliverySchema = z.object({
  name: z.string().trim().min(2, "Укажите имя получателя").max(100),
  phone: z.string().transform(s => s.replace(/\D/g, "")).transform(s => s.length === 9 ? `998${s}` : s).refine(s => /^998\d{9}$/.test(s), "Укажите номер Узбекистана: +998 и 9 цифр").transform(s => `+${s}`),
  method: z.enum(["delivery", "pickup"]), city: z.string().trim().min(2).max(120), address: z.string().trim().max(500),
  latitude: z.number().min(-90).max(90).nullable(), longitude: z.number().min(-180).max(180).nullable(),
  comment: z.string().trim().max(2000), requestedDate: z.string().max(10).refine(s => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s), "Неверная дата"),
}).superRefine((d, c) => {
  if (d.method === "delivery" && d.address.length < 5) c.addIssue({code:"custom",path:["address"],message:"Укажите улицу, дом и ориентир для доставки"});
  if ((d.latitude === null) !== (d.longitude === null)) c.addIssue({code:"custom",path:["latitude"],message:"Укажите обе координаты"});
  if (d.requestedDate && (Number.isNaN(Date.parse(d.requestedDate)) || d.requestedDate < new Date(Date.now()+5*60*60*1000).toISOString().slice(0,10))) c.addIssue({code:"custom",path:["requestedDate"],message:"Выберите сегодняшнюю или будущую дату"});
});
export const orderSchema = z.object({requestKey: z.string().uuid(), items:z.array(itemSchema).min(1).max(30), delivery:deliverySchema}).superRefine((order,ctx)=>{
  if(order.items.reduce((sum,item)=>sum+item.quantity,0)<20) ctx.addIssue({code:"custom",path:["items"],message:"Минимальный заказ — 20 кг"});
  order.items.forEach((item,index)=>{if(item.category==="custom" && item.purpose.length<3)ctx.addIssue({code:"custom",path:["items",index,"purpose"],message:"Укажите, для чего нужна упаковка"});});
});
