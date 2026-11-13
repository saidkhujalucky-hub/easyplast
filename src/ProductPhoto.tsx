"use client";
import {useState} from "react";
import {ImageOff} from "lucide-react";
import {useI18n} from "./I18n";
import type {ProductKey} from "./catalog";

const descriptions:Record<ProductKey,string>={
  water:"Бутыль 19 л в защитном полиэтиленовом пакете",
  cookies:"Полиэтиленовый вкладыш внутри коробки с печеньем",
  broccoli:"Мелкая перфорация голубоватой прозрачной плёнки крупным планом",
  carpets:"Ковёр в рулоне в защитном полиэтиленовом рукаве",
  tshirt:"Полиэтиленовые пакеты «Майка» с ручками",
  trash:"Один большой чёрный мешок для мусора",
  custom:"Прозрачная полиэтиленовая упаковка",
};

export default function ProductPhoto({kind,eager=false}:{kind:ProductKey;eager?:boolean}) {
  const {t}=useI18n();
  const [failedSource,setFailedSource]=useState("");
  const source=`./images/products/${kind==="trash"?"trash-bag":kind}.webp`;
  return <span className={`product-photo product-photo--${kind}`}>
    {failedSource===source?<span className="product-photo-unavailable" role="img" aria-label={t(descriptions[kind])}><ImageOff size={25}/><span>{t("Фото временно недоступно")}</span></span>:<img key={source} src={source} alt={t(descriptions[kind])} width={1000} height={1000} loading={eager?"eager":"lazy"} decoding="async" onError={()=>setFailedSource(source)}/>}
    {kind==="broccoli" && failedSource!==source && <span className="product-photo-caption">{t("Мелкая перфорация · крупный план")}</span>}
  </span>;
}
