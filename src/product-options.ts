import type {Product} from "./catalog";
export type SizeOption = {width:number;length?:number};
export function sizeOptions(product:Product):SizeOption[] {
  if(product.key==="carpets")return [40,50,60].map(width=>({width}));
  if(["custom","tshirt","trash"].includes(product.key))return [];
  return product.presets||[{width:product.width,length:product.length}];
}
export function matchesSize(product:Product,width:number,length:number) {
  return sizeOptions(product).some(size=>size.width===width&&(size.length===undefined||size.length===length));
}
