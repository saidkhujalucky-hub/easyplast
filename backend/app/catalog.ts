import {translate, type Language} from "./messages";
export type ProductKey = "water" | "cookies" | "broccoli" | "carpets" | "tshirt" | "trash" | "custom";
export type Product = { key: ProductKey; name: string; description: string; size: string; width: number; length: number; color: string; colorName: string; label: string; accent: string; presets?: {width:number;length:number}[] };
export const products: Product[] = [
  { key: "water", name: "Для воды", description: "Упаковка для 19-литровой бутыли", size: "48 × 70 см", width: 48, length: 70, color: "#2B5DE0", colorName: "Синий", label: "Оптимальный размер", accent: "#142237" },
  { key: "cookies", name: "Для печенья", description: "Полиэтиленовый вкладыш внутрь коробки", size: "70 × 45 / 70 × 38 / 70 × 42 см", width: 70, length: 45, color: "#F5F3EE", colorName: "Белый", label: "Оптимальные размеры", accent: "#25252A", presets: [{width:70,length:45},{width:70,length:38},{width:70,length:42}] },
  { key: "broccoli", name: "Для брокколи", description: "Голубоватый пакет с мелкой перфорацией", size: "100 × 80 см", width: 100, length: 80, color: "#2B5DE0", colorName: "Синий", label: "Оптимальный размер", accent: "#142B29" },
  { key: "carpets", name: "Для ковров", description: "Защитный рукав для ковра в рулоне", size: "40 / 50 / 60 см", width: 40, length: 100, color: "#2B5DE0", colorName: "Синий", label: "Рекомендуемая ширина", accent: "#20243B" },
  { key: "tshirt", name: "Пакеты «Майка»", description: "Для магазинов и супермаркетов", size: "Свой размер", width: 40, length: 60, color: "#F5F3EE", colorName: "Белый", label: "По вашим параметрам", accent: "#252332" },
  { key: "trash", name: "Пакеты для мусора", description: "Бытовые и промышленные", size: "Свой размер", width: 60, length: 80, color: "#292C32", colorName: "Чёрный", label: "По вашим параметрам", accent: "#1B252B" },
];
export const customProduct: Product = { key: "custom", name: "Свой вариант", description: "Упаковка по вашим параметрам", size: "Ваш размер", width: 60, length: 80, color: "#2B5DE0", colorName: "Синий", label: "Индивидуальный заказ", accent: "#142237" };
export const colors = [
  { name: "Синий", value: "#2B5DE0" },
  { name: "Белый", value: "#F5F3EE" },
  { name: "Прозрачный", value: "#ADCED5" },
  { name: "Чёрный", value: "#292C32" },
  { name: "Красный", value: "#DB6056" },
];
export type CartItem = { id: string; category: ProductKey; name: string; width: number; length?: number; thickness: number; color: string; colorName: string; quantity: number; purpose?: string; unitPrice?: number; lineTotal?: number };
export type Delivery = { name: string; phone: string; method: "delivery" | "pickup"; city: string; address: string; latitude: number | null; longitude: number | null; comment: string; requestedDate: string };
export type SavedOrder = { id: string; number: string; createdAt: number; status: string; items: CartItem[]; delivery: Delivery };
export const MIN_ORDER_KG = 20;
export const RECOMMENDED_THICKNESS = 5;
export const TRANSPARENT_COLOR = "#ADCED5";
export function formatItemDimensions(item:Pick<CartItem,"category"|"width"|"length">,lang:Language="ru") {
  const n=(value:number)=>new Intl.NumberFormat(lang==="ru"?"ru-RU":lang==="uz"?"uz-UZ":"en-US",{maximumFractionDigits:2}).format(value);
  const dimensions=item.category==="carpets"?`${translate("Ширина",lang)}: ${n(item.width)}`:`${n(item.width)} × ${n(item.length ?? 0)}`;
  return `${dimensions} ${translate("см",lang)}`;
}
export function getUnitPrice(category:ProductKey) { return category === "broccoli" ? 29000 : category === "carpets" ? 25000 : 26000; }
export function itemCost(item:Pick<CartItem,"category"|"quantity">) { return Math.round(getUnitPrice(item.category)*item.quantity); }
export function orderCost(items:Pick<CartItem,"category"|"quantity">[]) { return items.reduce((sum,item)=>sum+itemCost(item),0); }
export const defaultDelivery: Delivery = { name: "", phone: "+998 ", method: "delivery", city: "Ташкент", address: "", latitude: null, longitude: null, comment: "", requestedDate: "" };
export function mapsUrl(query: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`; }
export function makeId() {
  const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const h=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
export function orderText(order:SavedOrder,lang:Language="ru") {
  const t=(value:string)=>translate(value,lang),n=(value:number)=>new Intl.NumberFormat(lang==="ru"?"ru-RU":lang==="uz"?"uz-UZ":"en-US").format(value);
  const d=order.delivery;
  const location=d.latitude!==null&&d.longitude!==null?`${d.latitude},${d.longitude}`:`${d.city}, ${d.address}`;
  const lines=order.items.map(i=>{
    const rate=i.unitPrice ?? getUnitPrice(i.category),total=i.lineTotal ?? Math.round(rate*i.quantity);
    return `${t(i.name)}: ${formatItemDimensions(i,lang)}, ${i.thickness} ${t("мкм")}, ${t(i.colorName)} (${i.color}), ${n(i.quantity)} ${t("кг")}\n${i.purpose?`${t("Назначение")}: ${i.purpose}\n`:""}${t("Цена за кг")}: ${n(rate)} ${t("сум")}; ${n(total)} ${t("сум")}`;
  }).join("\n\n");
  const sum=order.items.reduce((total,i)=>total+(i.lineTotal ?? Math.round((i.unitPrice ?? getUnitPrice(i.category))*i.quantity)),0);
  return `${t("Здравствуйте! Заявка")} ${t(order.number)} ${t("в Easy Plast.")}\n\n${lines}\n\n${t("Итого:")} ${n(sum)} ${t("сум")}\n${d.name}, ${d.phone}\n${d.method==="delivery"?`${t("Доставка:")} ${d.city}, ${d.address}\n${mapsUrl(location)}`:t("Самовывоз — адрес и время согласуем")}${d.requestedDate?`\n${t("Желаемая дата:")} ${d.requestedDate}`:""}${d.comment?`\n${t("Комментарий:")} ${d.comment}`:""}\n${t("Стоимость доставки согласуем отдельно.")}\n${t("Прошу подтвердить стоимость и сроки.")}`;
}
