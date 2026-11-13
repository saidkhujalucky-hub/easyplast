"use client";
import {useState} from "react";
import {ArrowUpRight,Plus,Ruler,SlidersHorizontal,Box,ChevronDown,Droplets,Cookie,Sprout,Layers3,Shirt,Trash2} from "lucide-react";
import {useI18n} from "./I18n";
import ProductPhoto from "./ProductPhoto";
import {products,type Product,type ProductKey} from "./catalog";
import {sizeOptions,type SizeOption} from "./product-options";

const icons={water:Droplets,cookies:Cookie,broccoli:Sprout,carpets:Layers3,tshirt:Shirt,trash:Trash2,custom:SlidersHorizontal};
export function HeroShowcase({onConfigure}:{onConfigure:(product:Product)=>void}) {
  const {t}=useI18n();
  const [selected,setSelected]=useState(products[0]);
  return <div className="hero-showcase">
    <div className="showcase-heading"><span><span className="live-dot"/>{t("ПРИМЕРЫ УПАКОВКИ")}</span><span>EASY PLAST / CATALOG</span></div>
    <ProductPhoto kind={selected.key} eager/>
    <div className="showcase-caption"><div><span>{t("Упаковка в применении")}</span><b>{t(selected.name)}</b></div><button type="button" aria-label={`${t("Настроить")}: ${t(selected.name)}`} onClick={()=>onConfigure(selected)}><ArrowUpRight size={23}/></button></div>
    <div className="showcase-options" role="group" aria-label={t("Выбрать упаковку")}>{products.map(product=>{const Icon=icons[product.key];return <button type="button" key={product.key} aria-label={t(product.name)} aria-pressed={selected.key===product.key} onClick={()=>setSelected(product)}><Icon size={15}/><span>{t(product.name)}</span></button>;})}</div>
  </div>;
}

export function CatalogSizes({product,onChoose}:{product:Product;onChoose:(size:SizeOption|null)=>void}) {
  const {t}=useI18n();
  return <div className={`catalog-sizes ${product.key === "cookies" ? "cookie-size-grid" : ""}`} role="group" aria-label={`${t("Размер")}: ${t(product.name)}`}>
    {sizeOptions(product).map(size=><button type="button" key={`${size.width}-${size.length}`} onClick={()=>onChoose(size)}>{size.width}{size.length!==undefined?` × ${size.length}`:""} {t("см")}</button>)}
    <button className="own-size" type="button" onClick={()=>onChoose(null)}><Plus size={12}/>{t("Свой размер")}</button>
  </div>;
}

export function SizeSelector({product,mode,width,length,onPreset,onCustom}:{product:Product;mode:"preset"|"custom";width:number;length:number;onPreset:(size:SizeOption)=>void;onCustom:()=>void}) {
  const {t}=useI18n();
  return <div className="size-selector">
    <div className="size-selector-heading"><Ruler size={17}/><span>{t(sizeOptions(product).length?product.label:"Индивидуальный размер")}</span></div>
    <div className={`size-choice-buttons ${product.key === "cookies" ? "cookie-size-grid" : ""}`} role="group" aria-label={t("Выбор размера")}>
      {sizeOptions(product).map(size=><button type="button" key={`${size.width}-${size.length}`} aria-pressed={mode==="preset"&&width===size.width&&(size.length===undefined||length===size.length)} onClick={()=>onPreset(size)}>{size.width}{size.length!==undefined?` × ${size.length}`:""} {t("см")}</button>)}
      <button type="button" className="own-size" aria-pressed={mode==="custom"} onClick={onCustom}><Plus size={14}/>{t("Свой размер")}</button>
    </div>
    <p>{t(product.key==="carpets"?"Выберите ширину рукава или укажите свою. Заказ рассчитывается по весу.":mode==="custom"?"Введите свою ширину и длину ниже. Категория и цена за кг сохраняются.":"Можно выбрать готовый размер или ввести свои параметры.")}</p>
  </div>;
}

const productNotes:Record<ProductKey,string>={
  water:"Для бутыли 19 л. Проверьте габариты вашей бутыли и оставьте запас для упаковки.",
  cookies:"Вкладыш внутрь коробки с печеньем. Края плёнки загибаются поверх бортиков.",
  broccoli:"Голубоватый прозрачный пакет с множеством мелких отверстий для вентиляции.",
  carpets:"Для ковра в рулоне. Укажите ширину рукава в сложенном виде, толщину и вес заказа.",
  tshirt:"Для магазинов и супермаркетов. Укажите нужные ширину, длину и толщину пакета.",
  trash:"Для бытовых и промышленных задач. Подберите размер под контейнер и нужный объём.",
  custom:"Опишите, что будете упаковывать. Это поможет уточнить подходящие параметры.",
};
export function ProductNotes({product}:{product:Product}) {
  const {t}=useI18n();return <div className="product-detail-note"><Box size={20}/><div><b>{t(product.name)}</b><p>{t(productNotes[product.key])}</p></div></div>;
}

export function PackagingGuide({onCreate}:{onCreate:()=>void}) {
  const {t}=useI18n();
  const faqs=[
    ["Можно ли изменить размер в любой категории?","Да. Выберите «Свой размер» и задайте параметры. Для ковров указывается только ширина рукава. Цвет и толщина также настраиваются."],
    ["Можно ли объединить разные пакеты в одном заказе?","Да. Добавьте несколько позиций. Минимальный общий вес всей заявки — 20 кг."],
    ["Что означает толщина в микронах?","Микрон — единица толщины плёнки. Укажите нужное значение или обсудите его с менеджером с учётом вашего продукта."],
    ["Как рассчитывается стоимость?","Цена за кг умножается на вес каждой позиции. Сайт складывает стоимость упаковки, а доставка и печать согласуются отдельно."],
    ["Как заказать упаковку с логотипом?","Откройте раздел «С печатью» и позвоните нам. Уточним макет, размеры, цвет, объём и стоимость печати."],
    ["Когда будет готов заказ?","Сроки производства и доставки менеджер подтвердит после уточнения размеров, толщины и объёма заявки."],
  ];
  return <>
    <section className="packaging-guide shell" id="size-guide"><div className="section-top"><div><div className="eyebrow muted">{t("/ ДЕТАЛИ ИМЕЮТ ЗНАЧЕНИЕ")}</div><h2>{t("Три параметра.")}<br/>{t("Упаковка точно под вас.")}</h2></div><p className="section-aside">{t("Понятные размеры, наглядный выбор,")}<br/>{t("расчёт стоимости до отправки заявки.")}</p></div>
      <div className="guide-layout"><div className="measurement-figure"><span className="eyebrow">{t("КАК ИЗМЕРИТЬ ПАКЕТ")}</span><svg viewBox="0 0 420 325" fill="none" role="img" aria-label={t("Схема ширины и длины пакета")}><defs><linearGradient id="measure-film" x1="130" y1="80" x2="300" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#5276de" stopOpacity=".7"/><stop offset=".5" stopColor="#263f83" stopOpacity=".5"/><stop offset="1" stopColor="#91b4ff" stopOpacity=".45"/></linearGradient></defs><path d="M120 50L292 50L282 85L299 246L287 266L115 266L102 248L120 85Z" fill="url(#measure-film)" stroke="#97b6ff"/><path d="M120 65H289M120 72H286M117 257H287M125 91L137 112L129 231M278 91L267 112L278 230" stroke="#b2cbff" strokeOpacity=".5"/><path d="M107 284V299M299 284V299M107 292H299M107 292L114 288M107 292L114 296M299 292L292 288M299 292L292 296M322 50H340M322 266H340M332 50V266M332 50L328 57M332 50L336 57M332 266L328 259M332 266L336 259" stroke="#87abff"/><text x="203" y="318" textAnchor="middle" fill="#b8ceef" fontSize="12">{t("Ширина")}</text><text x="355" y="160" textAnchor="middle" fill="#b8ceef" fontSize="12" transform="rotate(90 355 160)">{t("Длина")}</text><path d="M71 105H94M71 175H94M81 105V175M71 217H94" stroke="#3c5480"/><text x="41" y="81" fill="#6f8bb5" fontSize="10">01 / CM</text></svg><p>{t("Замеряйте пакет в плоском виде. Для ковров указывается только ширина рукава в сложенном виде.")}</p></div>
        <div className="guide-parameters">{[
          {number:"01",title:"Размер в сантиметрах",text:"Для пакетов задаются ширина и длина. Для ковров — только ширина рукава. Свой размер доступен в каждом отделе.",tag:"см"},
          {number:"02",title:"Толщина в микронах",text:"Выберите предложенное значение или введите своё. Окончательные параметры можно согласовать с менеджером.",tag:"мкм"},
          {number:"03",title:"Цвет и прозрачность",text:"Синий, белый, прозрачный и другие цвета. Выберите нужный цвет в параметрах заказа.",tag:"PE"},
        ].map(item=><div className="guide-parameter" key={item.number}><span>{item.number}</span><div><h3>{t(item.title)}</h3><p>{t(item.text)}</p></div><i>{t(item.tag)}</i></div>)}<button className="text-link" onClick={onCreate}>{t("Перейти к своим параметрам")}<ArrowUpRight size={17}/></button></div>
      </div>
    </section>
    <section className="packaging-faq shell"><div><div className="eyebrow muted">{t("/ ПЕРЕД ЗАКАЗОМ")}</div><h2>{t("Разберёмся в деталях.")}</h2><p>{t("Нужна помощь с выбором?")}<br/><a href="https://t.me/easyplast" target="_blank" rel="noreferrer">{t("Напишите нам в Telegram")} <ArrowUpRight size={14}/></a></p></div><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{t(question)}<ChevronDown size={18}/></summary><p>{t(answer)}</p></details>)}</div></section>
  </>;
}
