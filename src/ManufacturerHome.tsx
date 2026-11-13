import {useState} from 'react';
import {ArrowRight, ArrowUpRight, Check, ChevronDown, Cookie, Factory, Layers3, Package, Phone, Printer, Ruler, Send, ShoppingBag} from 'lucide-react';
import {useI18n} from './I18n';
import {products, customProduct, getUnitPrice, type Product} from './catalog';
import {manufacturerCopy} from './manufacturer-copy';
import ProductPhoto from './ProductPhoto';

type Props = {onConfigure: (product: Product, ownSize?: boolean) => void; onPrinting: () => void};
export default function ManufacturerHome({onConfigure, onPrinting}: Props) {
  const {lang, t} = useI18n();
  const c = manufacturerCopy[lang];
  const [filter, setFilter] = useState('all');
  const orderedProducts = [...products].sort((a,b) => Number(b.key === 'carpets') - Number(a.key === 'carpets'));
  const formatPrice = (value: number) => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : 'en-US').format(value);
  const scrollCatalog = () => document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'});
  return <div className="manufacturer-home">
    <section className="mp-hero">
      <div className="shell mp-hero-layout">
        <div className="mp-hero-copy">
          <div className="mp-eyebrow"><span/>{c.eyebrow}</div>
          <h1>{c.title}<br/><span>{c.titleAccent}</span><br/>{c.titleLast}</h1>
          <p>{c.lead}</p>
          <div className="mp-hero-buttons"><button className="button blue" onClick={scrollCatalog}>{c.catalog}<ArrowRight size={18}/></button><button className="button outline" onClick={()=>onConfigure(customProduct)}>{c.quote}<ArrowUpRight size={18}/></button></div>
          <div className="mp-hero-proof"><Check size={16}/><span>{c.min} · {c.custom.toLowerCase()} · {c.print.toLowerCase()}</span></div>
        </div>
        <div className="mp-hero-visual">
          <div className="mp-visual-top"><span>EASY PLAST</span><span>PE / 01—06</span></div>
          <div className="mp-hero-photo"><ProductPhoto kind="carpets" eager/></div>
          <div className="mp-visual-title"><span>{c.heroTag}</span><strong>{c.heroCaption}</strong></div>
          <div className="mp-mini-photo"><ProductPhoto kind="cookies" eager/><span>{t('Для печенья')}<ArrowUpRight size={14}/></span></div>
          <span className="mp-visual-note">{c.heroNote}</span>
        </div>
      </div>
    </section>
    <div className="mp-benefits shell">{[{Icon:Package,title:c.min,note:c.minNote},{Icon:Ruler,title:c.custom,note:c.customNote},{Icon:Printer,title:c.print,note:c.printNote}].map(({Icon,title,note})=><div key={title}><Icon size={26} strokeWidth={1.5}/><div><strong>{title}</strong><span>{note}</span></div><ArrowUpRight size={18} className="mp-benefit-arrow"/></div>)}</div>

    <section className="mp-about" id="about"><div className="shell mp-about-layout"><div className="mp-about-stats"><div className="mp-about-wordmark"><Layers3 size={32}/>EASY PLAST</div><div className="mp-big-stat"><strong>2010<span>↗</span></strong><span>{c.since}</span></div><div className="mp-small-stats"><div><strong>06</strong><span>{c.categories}</span></div><div><strong>03</strong><span>{c.languages}</span></div></div></div><div className="mp-about-copy"><div className="mp-eyebrow">{c.aboutLabel}</div><h2>{c.aboutTitle}</h2><p>{c.aboutText}</p><p>{c.aboutText2}</p><a className="mp-inline-link" href="https://t.me/easyplast" target="_blank" rel="noreferrer">{c.aboutAction}<ArrowUpRight size={18}/></a></div></div></section>

    <section className="mp-catalog shell" id="catalog">
      <div className="mp-section-heading"><div><div className="mp-eyebrow">{c.catalogEyebrow}</div><h2>{c.catalogTitle}</h2></div><p>{c.catalogLead}</p></div>
      <div className="mp-filters" role="group" aria-label={t('Разделы каталога')}><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>{c.all}<span>06</span></button>{orderedProducts.map(p=><button key={p.key} aria-pressed={filter===p.key} onClick={()=>setFilter(p.key)}>{t(p.name)}</button>)}</div>
      <div className="mp-product-grid">{orderedProducts.filter(p=>filter==='all'||p.key===filter).map(p=><article className="mp-product-card" key={p.key}>
        <button className="mp-product-image" aria-label={`${t('Настроить')}: ${t(p.name)}`} onClick={()=>onConfigure(p)}><ProductPhoto kind={p.key}/><span className="mp-product-label">{p.key==='carpets'?t('РУКАВ'):t('ПАКЕТ')}</span><span className="mp-product-open"><ArrowUpRight size={21}/></span></button>
        <div className="mp-product-body"><h3>{t(p.name)}</h3><p>{t(p.description)}</p><div className="mp-product-spec"><Ruler size={14}/><span>{p.key==='cookies'?t('Оптимальные размеры'):t(p.size)}</span></div><div className="mp-product-bottom"><div><strong>{formatPrice(getUnitPrice(p.key))}</strong><span>{c.perKg}</span></div><button onClick={()=>onConfigure(p)} aria-label={`${c.configure}: ${t(p.name)}`}><ArrowRight size={21}/></button></div><button className="mp-product-link" onClick={()=>onConfigure(p)}>{c.configure}<ArrowUpRight size={14}/></button></div>
      </article>)}</div>
    </section>

    <section className="mp-industries"><div className="shell"><div className="mp-industry-intro"><div className="mp-eyebrow">{c.applicationLabel}</div><h2>{c.applicationTitle}</h2></div><div className="mp-industry-grid">{c.sectors.map(([title,text],i)=>{const Icon=[Cookie,ShoppingBag,Factory][i];return <div key={title}><Icon size={27} strokeWidth={1.4}/><h3>{title}</h3><p>{text}</p></div>;})}</div></div></section>

    <section className="mp-custom shell"><div><div className="mp-eyebrow">{c.customLabel}</div><h2>{c.customTitle}</h2><p>{c.customText}</p><button className="button blue" onClick={()=>onConfigure(customProduct,true)}>{c.customAction}<ArrowUpRight size={18}/></button></div><div className="mp-measurement"><div className="mp-measurement-tag"><Ruler size={14}/>{c.customMark}</div><svg viewBox="0 0 450 340" role="img" aria-label={`${c.width} / ${c.length}`}><defs><linearGradient id="mp-film" x1="0" x2="1" y2="1"><stop stopColor="#e8efff"/><stop offset=".5" stopColor="#fff"/><stop offset="1" stopColor="#bccffd"/></linearGradient></defs><path d="M140 55H300L292 87L305 266L293 280H135L124 266L139 87Z" fill="url(#mp-film)" stroke="#6d8cd1" strokeWidth="1.5"/><path d="M139 69H297M138 76H295M139 272H294M146 90L157 118L146 246M284 90L274 118L284 246" fill="none" stroke="#b0c2e6"/><path d="M125 300V318M305 300V318M125 309H305M125 309L132 305M125 309L132 313M305 309L298 305M305 309L298 313M329 55H345M329 280H345M337 55V280M337 55L333 62M337 55L341 62M337 280L333 273M337 280L341 273" stroke="#285ee8" fill="none"/><text x="215" y="335" textAnchor="middle" fill="#285ee8" fontSize="12">{c.width}, {c.cm}</text><text x="365" y="169" textAnchor="middle" fill="#285ee8" fontSize="12" transform="rotate(90 365 169)">{c.length}, {c.cm}</text><text x="215" y="172" textAnchor="middle" fill="#285ee8" fontSize="16" fontWeight="700">EASY PLAST</text><text x="215" y="190" textAnchor="middle" fill="#7f94be" fontSize="8" letterSpacing="2">POLYETHYLENE PACKAGING</text></svg><span>PE / CUSTOM SIZE</span></div></section>

    <section className="mp-print shell"><div className="mp-print-copy"><div className="mp-eyebrow">{c.printLabel}</div><h2>{c.printTitle}</h2><p>{c.printText}</p><button className="button white" onClick={onPrinting}>{c.printAction}<ArrowUpRight size={18}/></button></div><div className="mp-print-visual"><div className="mp-sample-bag"><span className="mp-handle"/><strong>{c.sample}</strong><span>YOUR STORY. YOUR PACKAGING.</span><i>PE / EASY PLAST</i></div><span className="mp-sample-caption">{c.sampleNote}</span></div></section>

    <section className="mp-process shell" id="process"><div className="mp-section-heading"><div><div className="mp-eyebrow">{c.processLabel}</div><h2>{c.processTitle}</h2></div></div><div className="mp-steps">{c.steps.map(([title,text],i)=><div key={title}><span className="mp-step-number">0{i+1}<ArrowRight size={20}/></span><h3>{title}</h3><p>{text}</p></div>)}</div></section>

    <section className="mp-faq shell" id="faq"><div><div className="mp-eyebrow">{c.faqLabel}</div><h2>{c.faqTitle}</h2></div><div className="mp-faq-list">{c.faqs.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p></details>)}</div></section>

    <section className="mp-contact" id="contact"><div className="shell mp-contact-layout"><div><div className="mp-eyebrow">{c.contactLabel}</div><h2>{c.contactTitle}</h2><p>{c.contactText}</p><a className="button blue" href="https://t.me/easyplast" target="_blank" rel="noreferrer"><Send size={18}/>{c.contactAction}</a></div><div className="mp-contact-details"><span>{c.call}</span><a href="tel:+998998705300">+998 99 870 53 00<Phone size={21}/></a><a href="tel:+998909875300">+998 90 987 53 00<Phone size={21}/></a><a href="mailto:infolog77@gmail.com" className="mp-email">infolog77@gmail.com<ArrowUpRight size={18}/></a></div></div></section>
  </div>;
}
