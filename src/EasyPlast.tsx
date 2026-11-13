"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Plus, Minus, X, ShoppingBag, UserRound, Menu, Check, Droplets, Cookie, Sprout, Layers3, Ruler, ShieldCheck, Truck, Phone, Send, MapPin, LocateFixed, ChevronRight, ClipboardList, LogOut, LoaderCircle, Trash2, PackageCheck, ExternalLink, Package, SlidersHorizontal, CheckCircle2, Shirt, Printer } from "lucide-react";
import ProductPhoto from "./ProductPhoto";
import {SizeSelector, ProductNotes} from "./PackagingDetails";
import {matchesSize, type SizeOption} from "./product-options";
import { useI18n, LanguageSwitcher } from "./I18n";
import GoogleSignIn from "./GoogleSignIn";
import {apiFetch,externalApi,storedApiSession,clearApiSession} from "./api-client";
import { products, customProduct, colors, colorsForProduct, defaultDelivery, mapsUrl, orderText, makeId, getUnitPrice, itemCost, orderCost, MIN_ORDER_KG, RECOMMENDED_THICKNESS, formatItemDimensions, TRANSPARENT_COLOR, type CartItem, type Product, type Delivery, type SavedOrder } from "./catalog";
import { itemSchema, deliverySchema } from "./order-validation";
import { siteCopy } from "./site-content";
import ManufacturerHome from "./ManufacturerHome";
import {manufacturerCopy} from "./manufacturer-copy";
import { parseGeoCoordinates } from "./geo-coordinates";
import AssistantWidget from "./AssistantWidget";
import ThemeSwitch from "./ThemeSwitch";
type View = "home" | "custom" | "cart" | "delivery" | "contacts" | "account" | "printing";
type User = {
    displayName: string;
    email: string;
};
const categoryIcons = { water: Droplets, cookies: Cookie, broccoli: Sprout, carpets: Layers3, tshirt: Shirt, trash: Trash2, custom: SlidersHorizontal };
export default function EasyPlast({ user: initialUser }: {
    user: User | null;
}) {
    const { lang, t } = useI18n();
    const brandCopy = manufacturerCopy[lang];
    const geoCopy = siteCopy[lang].geo;
    const formatWeight = (n: number) => new Intl.NumberFormat(lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US", { maximumFractionDigits: 2 }).format(n);
    const [user, setUser] = useState(initialUser), [view, setView] = useState<View>("home"), [menu, setMenu] = useState(false), [ready, setReady] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]), [delivery, setDelivery] = useState<Delivery>({ ...defaultDelivery, name: initialUser && !initialUser.displayName.includes("@") ? initialUser.displayName : "" });
    const [product, setProduct] = useState<Product>(customProduct), [width, setWidth] = useState(60), [length, setLength] = useState(80), [thickness, setThickness] = useState(RECOMMENDED_THICKNESS), [color, setColor] = useState("#2B5DE0"), [colorName, setColorName] = useState("Синий"), [quantity, setQuantity] = useState(20);
    const [sizeMode, setSizeMode] = useState<"preset" | "custom">("custom");
    const [locationInput, setLocationInput] = useState("");
    const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
    const widthInput = useRef<HTMLInputElement>(null);
    const [purpose, setPurpose] = useState(""), [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState(""), [authOpen, setAuthOpen] = useState(false), [mapQuery, setMapQuery] = useState("Ташкент, Узбекистан"), [locating, setLocating] = useState(false), [saving, setSaving] = useState(false), [error, setError] = useState(""), [orders, setOrders] = useState<SavedOrder[]>([]), [ordersLoading, setOrdersLoading] = useState(false), [orderError, setOrderError] = useState(""), [success, setSuccess] = useState<SavedOrder | null>(null);
    const authDialog = useRef<HTMLDialogElement>(null), requestKey = useRef(""), toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notify = useCallback((message: string) => { setToast(message); if (toastTimer.current)
        clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(""), 4500); }, []);
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("ep-cart-v1") || "[]");
            if (Array.isArray(stored))
                setCart(stored.map(i => itemSchema.safeParse(i)).filter(r => r.success).map(r => r.data as CartItem).slice(0, 30));
            const draft = JSON.parse(localStorage.getItem("ep-delivery-v1") || "null");
            if (draft && typeof draft === "object") {
                const safe = { ...defaultDelivery };
                for (const k of ["name", "phone", "city", "address", "comment", "requestedDate"] as const)
                    if (typeof draft[k] === "string")
                        safe[k] = draft[k];
                safe.method = draft.method === "pickup" ? "pickup" : "delivery";
                if (typeof draft.latitude === "number" && typeof draft.longitude === "number" && Math.abs(draft.latitude) <= 90 && Math.abs(draft.longitude) <= 180) {
                    safe.latitude = draft.latitude;
                    safe.longitude = draft.longitude;
                }
                setDelivery(safe);
                setMapQuery(safe.latitude !== null && safe.longitude !== null ? `${safe.latitude},${safe.longitude}` : `${safe.city}, ${safe.address || "Узбекистан"}`);
            }
            const key = localStorage.getItem("ep-request-key");
            requestKey.current = key && /^[0-9a-f-]{36}$/.test(key) ? key : makeId();
            localStorage.setItem("ep-request-key", requestKey.current);
        }
        catch {
            requestKey.current = makeId();
        }
        const fromHash = () => { const hash = location.hash.slice(1); setView(["custom", "cart", "delivery", "contacts", "account", "printing"].includes(hash) ? hash as View : "home"); if (["catalog", "about", "process", "faq", "contact"].includes(hash))
            setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 150); };
        fromHash();
        setReady(true);
        window.addEventListener("popstate", fromHash);
        return () => { window.removeEventListener("popstate", fromHash); if (toastTimer.current)
            clearTimeout(toastTimer.current); };
    }, []);
    useEffect(() => { if (ready)
        try {
            localStorage.setItem("ep-cart-v1", JSON.stringify(cart));
            localStorage.setItem("ep-delivery-v1", JSON.stringify(delivery));
        }
        catch { } }, [cart, delivery, ready]);
    useEffect(() => {
        if(!externalApi()||!storedApiSession())return;
        let active=true;
        void apiFetch("/api/auth/session").then(async response=>{
            if(!response.ok)return;
            const data=await response.json() as {user:User};
            if(active){setUser(data.user);setDelivery(current=>({...current,name:current.name||data.user.displayName}));}
        }).catch(()=>{});
        return()=>{active=false;};
    },[]);
    useEffect(() => { if (authOpen) {
        authDialog.current?.showModal();
    }
    else {
        authDialog.current?.close();
    } }, [authOpen]);
    const navigate = (next: View, anchor?: string) => { setView(next); setMenu(false); setError(""); window.history.pushState(null, "", `#${anchor || next}`); requestAnimationFrame(() => anchor ? document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "instant" })); };
    const choose = (p: Product) => { setProduct(p); setWidth(p.width); setLength(p.length); setThickness(RECOMMENDED_THICKNESS); setColor(p.color); setColorName(p.colorName); setPurpose(""); setEditingId(null); setSizeMode(matchesSize(p,p.width,p.length) ? "preset" : "custom"); };
    const focusOwnSize = () => { setSizeMode("custom"); requestAnimationFrame(() => widthInput.current?.focus()); };
    const configure = (p: Product, ownSize = false, size?: SizeOption) => { choose(p); if (ownSize) setSizeMode("custom"); if (size) { setWidth(size.width); if(size.length!==undefined)setLength(size.length); } navigate("custom"); if(ownSize)requestAnimationFrame(() => widthInput.current?.focus()); };
    const totalWeight = cart.reduce((s, i) => s + i.quantity, 0);
    const money = (value: number) => `${formatWeight(value)} ${t("сум")}`;
    const cartIssue = () => totalWeight < MIN_ORDER_KG ? "Минимальный заказ — 20 кг" : cart.some(i => i.category === "custom" && (!i.purpose || i.purpose.trim().length < 3)) ? "Укажите, для чего нужна упаковка" : "";
    const addToCart = (e: FormEvent) => {
        e.preventDefault();
        const item = { id: makeId(), category: product.key, name: product.name, width, ...(product.key === "carpets" ? {} : {length}), thickness, color, colorName: colorName || "Свой цвет", quantity, purpose: product.key === "custom" ? purpose.trim() : "" };
        if (product.key === "custom" && purpose.trim().length < 3) {
            notify("Укажите, для чего нужна упаковка");
            return;
        }
        const valid = itemSchema.safeParse(item);
        if (!valid.success) {
            notify("Проверьте размеры, толщину и объём заказа.");
            return;
        }
        if (!editingId && cart.length >= 30) {
            notify("В одной заявке может быть до 30 позиций.");
            return;
        }
        setCart(c => editingId ? c.map(old => old.id === editingId ? { ...item, id: editingId } : old) : [...c, item]);
        notify(editingId ? "Изменения сохранены" : "Упаковка добавлена в вашу заявку");
        setEditingId(null);
    };
    const loadOrders = useCallback(async () => {
        if (!user)
            return;
        setOrdersLoading(true);
        setOrderError("");
        try {
            const r = await apiFetch("/api/orders", { cache: "no-store", headers: { "X-EasyPlast-Language": lang } });
            const data = await r.json() as {
                orders: SavedOrder[];
                error?: string;
            };
            if(r.status===401){setUser(null);clearApiSession();}
            if (!r.ok)
                throw new Error(data.error);
            setOrders(data.orders);
        }
        catch (e) {
            setOrderError(e instanceof Error ? e.message : "Не удалось загрузить заявки.");
        }
        finally {
            setOrdersLoading(false);
        }
    }, [user, lang]);
    useEffect(() => { if (view === "account" && user)
        void loadOrders(); }, [view, user, loadOrders]);
    const updateDelivery = (change: Partial<Delivery>) => { setDelivery(d => ({ ...d, ...change })); setError(""); };
    const saveLocationPoint = (latitude: number, longitude: number, accuracy: number | null = null) => {
        const lat = Number(latitude.toFixed(6));
        const lon = Number(longitude.toFixed(6));
        updateDelivery({ latitude: lat, longitude: lon });
        setMapQuery([lat, lon].join(","));
        setLocationAccuracy(accuracy);
        notify(geoCopy.saved);
    };
    const applyLocationInput = () => {
        const point = parseGeoCoordinates(locationInput);
        if (!point) {
            setError(geoCopy.invalid);
            return;
        }
        saveLocationPoint(point.latitude, point.longitude);
    };
    const clearLocationPoint = () => {
        updateDelivery({ latitude: null, longitude: null });
        setLocationAccuracy(null);
        setLocationInput("");
        setMapQuery([delivery.city, delivery.address, "Узбекистан"].filter(Boolean).join(", "));
    };
    const locate = () => {
        if (!window.isSecureContext) {
            setError(geoCopy.insecure);
            return;
        }
        if (!navigator.geolocation) {
            setError(geoCopy.unsupported);
            return;
        }
        setLocating(true);
        setError("");
        const success = (position: GeolocationPosition) => {
            setLocating(false);
            saveLocationPoint(position.coords.latitude, position.coords.longitude, Math.round(position.coords.accuracy));
        };
        const error = (reason: GeolocationPositionError, highAccuracy: boolean) => {
            if (reason.code === 3 && highAccuracy) {
                tryLocate(false);
                return;
            }
            setLocating(false);
            setError(reason.code === 1 ? geoCopy.denied : reason.code === 3 ? geoCopy.timeout : geoCopy.unavailable);
        };
        const tryLocate = (highAccuracy: boolean) =>
            navigator.geolocation.getCurrentPosition(
                success,
                reason => error(reason, highAccuracy),
                {enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 12000 : 15000, maximumAge: 0}
            );
        tryLocate(true);
    };
    const submitOrder = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (cartIssue()) {
            setError(cartIssue());
            return;
        }
        if (!cart.length) {
            setError("Сначала добавьте упаковку в заявку.");
            return;
        }
        const parsed = deliverySchema.safeParse(delivery);
        if (!parsed.success) {
            setError(parsed.error.issues[0].message);
            return;
        }
        if (!user) {
            setAuthOpen(true);
            return;
        }
        setSaving(true);
        try {
            const r = await apiFetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json", "X-EasyPlast-Language": lang }, body: JSON.stringify({ requestKey: requestKey.current, items: cart, delivery: parsed.data }) });
            const data = await r.json() as {
                order: SavedOrder;
                error?: string;
            };
            if (r.status === 401) {
                setUser(null);
                setAuthOpen(true);
                throw new Error("Войдите через Google, чтобы сохранить заявку.");
            }
            if (!r.ok)
                throw new Error(data.error || "Не удалось сохранить заявку.");
            setSuccess(data.order);
            setCart([]);
            requestKey.current = makeId();
            try {
                localStorage.setItem("ep-request-key", requestKey.current);
            }
            catch { }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось сохранить заявку. Попробуйте ещё раз.");
        }
        finally {
            setSaving(false);
        }
    };
    const shareDraft = () => {
        if (cartIssue()) {
            setError(cartIssue());
            return;
        }
        const result = deliverySchema.safeParse(delivery);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }
        if (!cart.length) {
            setError("Добавьте хотя бы одну позицию.");
            return;
        }
        const draft: SavedOrder = { id: "draft", number: "без номера — расчёт стоимости", createdAt: Date.now(), status: "draft", items: cart, delivery: result.data };
        window.open(`https://t.me/easyplast?text=${encodeURIComponent(orderText(draft, lang))}`, "_blank", "noopener,noreferrer");
    };
    const logout = async () => { try {
        const r = await apiFetch("/api/auth/logout", { method: "POST" });
        if (!r.ok)
            throw new Error();
        window.google?.accounts.id.disableAutoSelect();
        clearApiSession();
        setUser(null);
        setOrders([]);
        notify("Вы вышли из аккаунта");
    }
    catch {
        notify("Не удалось выйти. Попробуйте ещё раз.");
    } };
    const editItem = (item: CartItem) => { const base=[...products, customProduct].find(p => p.key === item.category) || customProduct; choose(base); setWidth(item.width); setLength(item.length ?? base.length); setColor(item.color); setColorName(item.colorName); setSizeMode(matchesSize(base,item.width,item.length ?? base.length) ? "preset" : "custom"); setThickness(item.thickness); setQuantity(item.quantity); setPurpose(item.purpose || ""); setEditingId(item.id); navigate("custom"); };
    const breadcrumb = (title: string) => <div className="breadcrumb"><button onClick={() => navigate("home")}>{t("Главная")}</button><ChevronRight size={13}/><span>{t(title)}</span></div>;
    return <>
    <div className="topline"><div className="shell"><span><span className="live-dot"/>{brandCopy.top}</span><a href="tel:+998998705300">+998 99 870 53 00 <ArrowUpRight size={12}/></a></div></div>
    <header className="site-header"><div className="shell header-inner">
      <button className="brand" aria-label={t("Easy Plast \u2014 главная")} onClick={() => navigate("home")}><span className="brand-icon"><i /><i /><i /></span><span>easy<span className="brand-light">plast</span><span className="brand-dot">.</span></span></button>
      <nav className={menu ? "main-nav is-open" : "main-nav"} aria-label={t("Главное меню")}>
        <button className={view === "home" ? "active" : ""} onClick={() => navigate("home", "catalog")}>{t("Каталог")}</button>
        <button onClick={() => navigate("home", "about")}>{brandCopy.navAbout}</button>
        <button className={view === "printing" ? "active" : ""} onClick={() => navigate("printing")}>{t("С печатью")}</button>
        <button onClick={() => navigate("home", "process")}>{brandCopy.navProcess}</button>
        <button className={view === "contacts" ? "active" : ""} onClick={() => navigate("contacts")}>{t("Контакты")}</button>
      </nav>
      <div className="header-actions"><ThemeSwitch /><LanguageSwitcher /><button className="account-button" aria-label={user ? t("Личный кабинет") : t("Войти")} onClick={() => user ? navigate("account") : setAuthOpen(true)}><UserRound size={18}/><span>{user ? t("Кабинет") : t("Войти")}</span></button><button className="cart-button" onClick={() => navigate("cart")} aria-label={`${t("Ваша заявка")}, ${cart.length}`}><ShoppingBag size={19}/><span className="cart-count">{cart.length}</span></button><button className="mobile-menu-button" aria-label={menu ? t("Закрыть меню") : t("Открыть меню")} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>
    </div></header>

    <main>
      {view === "home" && <ManufacturerHome onConfigure={configure} onPrinting={()=>navigate("printing")}/>}

      {view === "custom" && <section className="shell page-section">{breadcrumb(t("Создать упаковку"))}<div className="page-heading"><div className="eyebrow muted">{t("/ КОНФИГУРАТОР")}</div><h1>{t("Упаковка по вашим правилам.")}</h1><p>{t("Выберите решение и настройте его под свой продукт.")}</p></div><div className="config-layout"><div className="config-preview"><div className="preview-stage" style={{ background: product.accent }}><ProductPhoto kind={product.key} eager/><div className="preview-size">{formatItemDimensions({category:product.key,width,length},lang)}</div></div><dl className="preview-specifications"><div><dt>{t("Цвет")}</dt><dd><i className={color===TRANSPARENT_COLOR?"clear-swatch":""} style={{background:color}}/>{t(colorName||"Свой цвет")}</dd></div><div><dt>{t("Толщина")}</dt><dd>{thickness||"—"} {t("мкм")}</dd></div><div><dt>{t("Объём заказа")}</dt><dd>{quantity||"—"} {t("кг")}</dd></div></dl><div className="preview-disclaimer"><ShieldCheck size={19}/><p>{t("На фото — пример применения упаковки.")}<br />{t("Детали производства уточнит менеджер.")}</p></div></div><form className="config-form" onSubmit={addToCart}><div className="form-section"><div className="form-section-title"><span>01</span><h2>{t("Для какого продукта?")}</h2></div><div className="config-categories">{[...products, customProduct].map(p => { const Icon = categoryIcons[p.key]; return <button type="button" key={p.key} className={product.key === p.key ? "selected" : ""} onClick={() => choose(p)}><Icon size={17}/>{t(p.name)}</button>; })}</div><ProductNotes product={product}/>{product.key === "custom" && <label className="purpose-field">{t("Для чего нужна упаковка?")}<input required minLength={3} maxLength={200} placeholder={t("Например: для одежды, хлеба или запчастей")} value={purpose} onChange={e => setPurpose(e.target.value)}/></label>}</div><div className="form-section"><div className="form-section-title"><span>02</span><h2>{t("Размер и толщина")}</h2></div><SizeSelector product={product} mode={sizeMode} width={width} length={length} onCustom={focusOwnSize} onPreset={size=>{setSizeMode("preset");setWidth(size.width);if(size.length!==undefined)setLength(size.length);}}/><div className={`dimension-inputs ${sizeMode==="custom"?"is-custom":""}`}><div className="dimension-input-heading"><span>{t(sizeMode==="custom"?"Ваш индивидуальный размер":"Выбранные размеры")}</span>{sizeMode==="custom"&&<Ruler size={14}/>}</div><div className={`input-grid ${product.key === "carpets" ? "two" : "three"}`}><label>{t("Ширина")}<div className="input-unit"><input type="number" min="1" max="1000" step="0.1" required ref={widthInput} value={width || ""} onChange={e => {setWidth(Number(e.target.value));setSizeMode("custom");}}/><span>{t("см")}</span></div></label>{product.key !== "carpets" && <label>{t("Длина")}<div className="input-unit"><input type="number" min="1" max="5000" step="0.1" required value={length || ""} onChange={e => {setLength(Number(e.target.value));if(product.key!=="carpets")setSizeMode("custom");}}/><span>{t("см")}</span></div></label>}<label>{t("Толщина")}<div className="input-unit"><input type="number" min="5" max="1000" required value={thickness || ""} onChange={e => setThickness(Number(e.target.value))}/><span>{t("мкм")}</span></div></label></div><p className="field-hint">{product.key === "carpets" ? t("Укажите ширину рукава в сложенном виде.") : t("Укажите свой размер или оставьте оптимальные параметры.")}</p></div><div className="thickness-presets"><span>{t("Толщина:")}</span>{[RECOMMENDED_THICKNESS, 30, 50, 80, 100].map(presetThickness => <button type="button" key={presetThickness} className={thickness === presetThickness ? "selected" : ""} onClick={() => setThickness(presetThickness)}>{presetThickness}{t(" мкм")}{presetThickness === RECOMMENDED_THICKNESS && <small>{t("рекомендуем")}</small>}</button>)}</div></div><div className="form-section"><div className="form-section-title"><span>03</span><h2>{t("Выберите цвет")}</h2><small>{t(colorName)}</small></div><div className="color-options">{colorsForProduct(product.key).map(c => <button type="button" key={c.value} className={`color-option ${color === c.value ? "selected" : ""} ${c.value === TRANSPARENT_COLOR ? "clear-swatch" : ""}`} onClick={() => { setColor(c.value); setColorName(c.name); }} aria-label={t(c.name)} title={t(c.name)} style={{ backgroundColor: c.value === TRANSPARENT_COLOR ? "transparent" : c.value }}>{color === c.value && <Check size={19} color={c.name === "Белый" || c.name === "Прозрачный" ? "#253446" : "white"}/>}</button>)}{product.key === "custom" && <label className="custom-color" title={t("Выбрать свой цвет")}><Plus size={20}/><input type="color" aria-label={t("Свой цвет")} value={color} onChange={e => { setColor(e.target.value); setColorName("Свой цвет"); }}/></label>}</div>{(!colors.some(c => c.value === color) || colorName === "Свой цвет") && <label className="custom-color-name">{t("Название или код цвета")}<input placeholder={t("Например, тёмно-зелёный / RAL 6005")} value={colorName === "Свой цвет" ? "" : colorName} maxLength={80} onChange={e => setColorName(e.target.value || t("Свой цвет"))}/></label>}</div><div className="form-section last"><div className="form-section-title"><span>04</span><h2>{t("Объём заказа")}</h2></div><div className="quantity-field"><div className="input-unit"><input aria-label={t("Объём заказа")} type="number" min="1" max="1000000" step="1" required value={quantity || ""} onChange={e => setQuantity(Number(e.target.value))}/><span>{t("кг")}</span></div><p>{money(getUnitPrice(product.key))}{t(" / кг")}<br />{t("Минимальный заказ \u2014 20 кг")}</p></div><div className="config-cost"><span>{t("Стоимость упаковки")}</span><b>{money(getUnitPrice(product.key) * quantity)}</b></div></div><button className="button blue full add-to-cart" type="submit">{editingId ? t("Сохранить изменения") : t("Добавить в заявку")} <Plus size={20}/></button>{cart.length > 0 && <button className="text-link view-cart" type="button" onClick={() => navigate("cart")}>{t("Перейти к заявке \u00B7 ")}{cart.length}{t(" поз. ")}<ArrowRight size={16}/></button>}</form></div></section>}

      {view === "cart" && <section className="shell page-section">{breadcrumb(t("Ваша заявка"))}<div className="page-heading"><div className="eyebrow muted">{t("/ ВАША УПАКОВКА")}</div><h1>{t("Всё, что вам нужно.")}</h1><p>{t("Проверьте параметры перед оформлением заявки.")}</p></div>{cart.length === 0 ? <div className="empty-state"><ShoppingBag size={38} strokeWidth={1.2}/><h2>{t("Здесь будет ваша упаковка")}</h2><p>{t("Выберите готовое решение или создайте свой вариант.")}</p><button className="button blue" onClick={() => navigate("home", "catalog")}>{t("Открыть каталог ")}<ArrowRight size={18}/></button></div> : <div className="cart-layout"><div className="cart-items">{cart.map(item => <article className="cart-item" key={item.id}><div className="cart-art"><ProductPhoto kind={item.category}/></div><div className="cart-item-info"><h3>{t(item.name)}</h3><p>{formatItemDimensions(item,lang)} <span>·</span> {item.thickness}{t(" мкм")}</p><span className="item-color"><i style={{ background: item.color }}/>{t(item.colorName)}</span>{item.purpose && <p className="purpose-text">{item.purpose}</p>}<div className="cart-line-cost">{money(getUnitPrice(item.category))}{t(" / кг \u00B7 ")}<b>{money(itemCost(item))}</b></div><button className="text-link" onClick={() => editItem(item)}>{t("Изменить параметры")}</button></div><div className="cart-item-controls"><button className="remove-button" aria-label={`${t("Удалить")}: ${t(item.name)}`} onClick={() => setCart(c => c.filter(i => i.id !== item.id))}><Trash2 size={17}/></button><label className="small-quantity"><input aria-label={`${t("Объём")}: ${t(item.name)}`} type="number" min="1" max="1000000" value={item.quantity} onChange={e => { const n = Number(e.target.value); if (n >= 1 && n <= 1000000)
        setCart(c => c.map(i => i.id === item.id ? { ...i, quantity: n } : i)); }}/><span>{t("кг")}</span></label></div></article>)}<button className="button outline" onClick={() => navigate("home", "catalog")}><Plus size={17}/>{t("Добавить ещё упаковку")}</button></div><aside className="order-summary"><span className="eyebrow muted">{t("ИТОГО В ЗАЯВКЕ")}</span><div className="summary-line"><span>{t("Позиций")}</span><b>{cart.length}</b></div><div className="summary-line"><span>{t("Общий объём")}</span><b>{formatWeight(totalWeight)}{t(" кг")}</b></div><div className="summary-price"><span>{t("Стоимость")}</span><b>{money(orderCost(cart))}</b><p>{t("Стоимость доставки согласуем отдельно.")}</p></div>{cartIssue() && <p className="minimum-order-note">{t(cartIssue())}</p>}<button className="button blue full" onClick={() => { if (cartIssue()) {
        notify(cartIssue());
        return;
    } setSuccess(null); navigate("delivery"); }}>{t("Оформить доставку ")}<ArrowRight size={18}/></button><p className="fineprint">{t("Заявка не требует предоплаты на сайте.")}</p></aside></div>}</section>}

      {view === "delivery" && <section className="shell page-section">{breadcrumb(t("Доставка и оформление"))}{success ? <div className="success-state"><span className="success-icon"><Check size={34}/></span><div className="eyebrow muted">{t("ЗАЯВКА СОХРАНЕНА")}</div><h1>{t("Спасибо, ")}{success.delivery.name.split(" ")[0]}!</h1><p>{t("Ваша заявка ")}<b>{success.number}</b>{t(" появилась в личном кабинете.")}<br />{t("Отправьте её менеджеру в Telegram, чтобы согласовать цену и доставку.")}</p><a className="button blue" href={`https://t.me/easyplast?text=${encodeURIComponent(orderText(success, lang))}`} target="_blank" rel="noreferrer"><Send size={18}/>{t("Передать менеджеру в Telegram")}</a><button className="button outline" onClick={() => navigate("account")}>{t("Мои заявки ")}<ClipboardList size={18}/></button><p className="fineprint">{t("Telegram откроет подготовленный текст. Нажмите \u00ABОтправить\u00BB в чате.")}</p></div> : <><div className="page-heading"><div className="eyebrow muted">{t("/ ДОСТАВКА И ОФОРМЛЕНИЕ")}</div><h1>{t("Доставим туда, где вы.")}</h1><p>{t("Укажите контакты и адрес. Стоимость и сроки согласуем лично.")}</p></div>{cart.length === 0 ? <div className="empty-state"><Truck size={42} strokeWidth={1.2}/><h2>{t("Начнём с упаковки")}</h2><p>{t("Добавьте позиции в заявку, чтобы оформить доставку.")}</p><button className="button blue" onClick={() => navigate("home", "catalog")}>{t("Выбрать упаковку ")}<ArrowRight size={18}/></button><a className="text-link" href="https://t.me/easyplast" target="_blank" rel="noreferrer">{t("Обсудить доставку с менеджером ")}<ArrowUpRight size={16}/></a></div> : <form className="checkout-layout" onSubmit={submitOrder}><div className="checkout-form"><div className="form-section"><div className="form-section-title"><span>01</span><h2>{t("Ваши контакты")}</h2></div><div className="input-grid"><label>{t("Имя получателя")}<input autoComplete="name" required minLength={2} maxLength={100} value={delivery.name} placeholder={t("Как к вам обращаться?")} onChange={e => updateDelivery({ name: e.target.value })}/></label><label>{t("Телефон")}<input autoComplete="tel" type="tel" inputMode="tel" required maxLength={24} value={delivery.phone} placeholder="+998 99 123 45 67" onChange={e => updateDelivery({ phone: e.target.value })}/></label></div></div><div className="form-section"><div className="form-section-title"><span>02</span><h2>{t("Как вам удобнее?")}</h2></div><div className="delivery-methods"><button type="button" className={delivery.method === "delivery" ? "selected" : ""} onClick={() => updateDelivery({ method: "delivery" })}><Truck size={23}/><b>{t("Доставка")}</b><span>{t("По вашему адресу")}</span><i>{delivery.method === "delivery" && <Check size={12}/>}</i></button><button type="button" className={delivery.method === "pickup" ? "selected" : ""} onClick={() => updateDelivery({ method: "pickup" })}><Package size={23}/><b>{t("Самовывоз")}</b><span>{t("Адрес согласуем лично")}</span><i>{delivery.method === "pickup" && <Check size={12}/>}</i></button></div>{delivery.method === "delivery" && <div className="address-fields"><label>{t("Город / населённый пункт")}<input required minLength={2} maxLength={120} value={delivery.city} onChange={e => { updateDelivery({ city: e.target.value, latitude: null, longitude: null }); setLocationAccuracy(null); setMapQuery(""); }} placeholder={t("Ташкент")}/></label><label>{t("Улица, дом и ориентир")}<input required minLength={5} maxLength={500} value={delivery.address} onChange={e => { updateDelivery({ address: e.target.value, latitude: null, longitude: null }); setLocationAccuracy(null); setMapQuery(""); }} placeholder={t("Улица, номер дома, ориентир")} autoComplete="street-address"/></label><div className="map-actions"><button type="button" className="button outline small" onClick={() => { clearLocationPoint(); setMapQuery([delivery.city, delivery.address, "Узбекистан"].filter(Boolean).join(", ")); }}><MapPin size={16}/>{t("Показать адрес")}</button><button type="button" className="text-link" disabled={locating} onClick={locate}>{locating ? <LoaderCircle size={16} className="spin"/> : <LocateFixed size={16}/>} {locating ? geoCopy.finding : geoCopy.auto}</button></div>
          <div className="location-picker"><div className="location-picker-title"><MapPin size={17}/><strong>{geoCopy.heading}</strong></div><label>{geoCopy.pasteLabel}<input type="text" inputMode="text" value={locationInput} onChange={e=>setLocationInput(e.target.value)} placeholder={geoCopy.placeholder} autoComplete="off" maxLength={2048}/></label>
          <div className="location-picker-actions"><button type="button" className="button outline small" disabled={!locationInput.trim()} onClick={applyLocationInput}><MapPin size={15}/>{geoCopy.apply}</button>{delivery.latitude !== null && <button type="button" className="text-link" onClick={clearLocationPoint}><X size={14}/>{geoCopy.clear}</button>}</div><p className="field-hint">{geoCopy.hint}</p></div>
          <div className="google-map">{mapQuery ? <iframe title={t("Адрес доставки на Google Картах")} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed&hl=${lang}`} width="100%" height="310" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <div className="map-empty">{geoCopy.keepAddress}</div>}{mapQuery && <a href={mapsUrl(mapQuery)} target="_blank" rel="noreferrer">{t("Открыть Google Карты ")}<ExternalLink size={13}/></a>}</div>{delivery.latitude !== null && <p className="field-hint geo-saved"><Check size={13}/>{geoCopy.saved} {delivery.latitude}, {delivery.longitude}{locationAccuracy !== null && ` · ${geoCopy.accuracy}: ±${locationAccuracy} м`}</p>}<p className="field-hint">{geoCopy.keepAddress}</p></div>}</div><div className="form-section last"><div className="form-section-title"><span>03</span><h2>{t("Пожелания к заказу")}</h2></div><label>{t("Желаемая дата ")}<span className="optional">{t("необязательно")}</span><input type="date" min={new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10)} value={delivery.requestedDate} onChange={e => updateDelivery({ requestedDate: e.target.value })}/></label><label>{t("Комментарий ")}<span className="optional">{t("необязательно")}</span><textarea rows={3} maxLength={2000} placeholder={t("Время приёма, подъезд, особенности упаковки\u2026")} value={delivery.comment} onChange={e => updateDelivery({ comment: e.target.value })}/></label></div></div><aside className="order-summary checkout-summary"><span className="eyebrow muted">{t("ВАША ЗАЯВКА")}</span><div className="checkout-items">{cart.map(i => <div key={i.id}><div><b>{t(i.name)}</b><span>{formatItemDimensions(i,lang)} · {i.thickness}{t(" мкм")}</span><span>{t(i.colorName)}</span>{i.purpose && <span className="purpose-text">{i.purpose}</span>}<span>{money(getUnitPrice(i.category))}{t(" / кг")}</span></div><strong>{formatWeight(i.quantity)}{t(" кг")}<br /><small>{money(itemCost(i))}</small></strong></div>)}</div><div className="summary-line"><span>{t("Общий объём")}</span><b>{formatWeight(totalWeight)}{t(" кг")}</b></div><div className="summary-price"><span>{t("Стоимость упаковки")}</span><b>{money(orderCost(cart))}</b><p>{t("Стоимость доставки согласуем отдельно.")}</p></div>{error && <div className="form-error" role="alert">{t(error)}</div>}<button className="button blue full" type="submit" disabled={saving}>{saving ? <><LoaderCircle size={18} className="spin"/>{t("Сохраняем\u2026")}</> : <>{user ? t("Сохранить заявку") : t("Войти и сохранить заявку")}<ArrowUpRight size={18}/></>}</button><button className="button outline full telegram-draft" type="button" onClick={shareDraft}><Send size={17}/>{t("Передать в Telegram")}</button><p className="fineprint">{t("Вход через Google сохраняет историю заявок. В Telegram можно отправить заявку без входа.")}</p><button type="button" className="text-link" onClick={() => navigate("cart")}><ArrowLeft size={14}/>{t("Изменить состав")}</button></aside></form>}</>}</section>}

      {view === "printing" && <section className="shell page-section printing-page">{breadcrumb(t("Упаковка с печатью"))}<div className="page-heading"><div className="eyebrow muted">{t("/ ПЕЧАТЬ НА ПОЛИЭТИЛЕНЕ")}</div><h1>{t("Ваш бренд.")}<br />{t("На вашей упаковке.")}</h1><p>{t("Пакеты и полиэтилен с печатью под ваш бизнес.")}</p></div><div className="printing-panel"><div className="printing-visual"><Printer size={56} strokeWidth={1}/><span>EASY PLAST</span><div className="print-sample">{t("Ваш бренд.")}</div></div><div><h2>{t("Позвоните нам и уточните детали")}</h2><p>{t("Обсудим логотип, размеры, цвет, толщину и объём заказа. Стоимость печати и сроки согласуем индивидуально.")}</p><a className="button blue" href="tel:+998998705300"><Phone size={18}/>+998 99 870 53 00</a><a className="button outline" href="tel:+998909875300"><Phone size={18}/>+998 90 987 53 00</a><a className="text-link" href="https://t.me/easyplast" target="_blank" rel="noreferrer"><Send size={16}/>{t("Написать в Telegram")}</a></div></div></section>}
      {view === "contacts" && <section className="shell page-section contacts-page">{breadcrumb(t("Связаться с нами"))}<div className="page-heading"><div className="eyebrow muted">{t("/ ДАВАЙТЕ НА СВЯЗИ")}</div><h1>{t("Всё начинается")}<br />{t("с разговора.")}</h1><p>{t("Поможем с размером, подберём параметры")}<br />{t("и обсудим доставку вашего заказа.")}</p></div><div className="contact-grid"><a className="contact-card primary-contact" href="https://t.me/easyplast" target="_blank" rel="noreferrer"><Send size={31}/><span>{t("НАПИШИТЕ НАМ")}</span><h2>@easyplast</h2><p>{t("Обсудим вашу упаковку в Telegram.")}</p><ArrowUpRight className="contact-arrow" size={25}/></a>{["998998705300", "998909875300"].map((n, i) => <a key={n} className="contact-card" href={`tel:+${n}`}><Phone size={29}/><span>{t("ПОЗВОНИТЕ НАМ")}</span><h2>{i === 0 ? "99 870 53 00" : "90 987 53 00"}</h2><p>{t("+998 \u00B7 Консультация и заявки")}</p><ArrowUpRight className="contact-arrow" size={25}/></a>)}</div><div className="contact-bottom"><div><Truck size={26}/><h2>{t("Доставка по вашему адресу")}</h2><p>{t("Укажите адрес при оформлении заявки.")}<br />{t("Маршрут, стоимость и дату согласуем с вами.")}</p><button className="text-link" onClick={() => { setSuccess(null); navigate("delivery"); }}>{t("Перейти к доставке ")}<ArrowRight size={17}/></button></div><div><Ruler size={26}/><h2>{t("Нужен особенный размер?")}</h2><p>{t("Выберите цвет, толщину и размеры.")}<br />{t("Менеджер поможет уточнить детали.")}</p><button className="text-link" onClick={() => configure(customProduct)}>{t("Создать свою упаковку ")}<ArrowRight size={17}/></button></div></div></section>}

      {view === "account" && <section className="shell page-section">{breadcrumb(t("Личный кабинет"))}<div className="page-heading"><div className="eyebrow muted">{t("/ EASY PLAST \u2014 ВАШ КАБИНЕТ")}</div><h1>{t("Ваши заявки.")}</h1><p>{t("Все параметры, адреса и история \u2014 в одном месте.")}</p></div>{!user ? <div className="empty-state"><UserRound size={40} strokeWidth={1.2}/><h2>{t("Войдите через Google")}</h2><p>{t("Чтобы сохранять заявки и возвращаться к ним с любого устройства.")}</p><button className="button blue" onClick={() => setAuthOpen(true)}>{t("Войти через Google ")}<ArrowRight size={18}/></button></div> : <><div className="account-profile"><div className="avatar">{user.displayName[0]?.toUpperCase()}</div><div><b>{user.displayName}</b><span>{user.email}</span></div><button className="button outline small" onClick={logout}><LogOut size={16}/>{t("Выйти")}</button></div>{ordersLoading ? <div className="empty-state"><LoaderCircle className="spin" size={28}/><p>{t("Загружаем ваши заявки\u2026")}</p></div> : orderError ? <div className="empty-state"><p role="alert">{t(orderError)}</p><button className="button outline" onClick={() => void loadOrders()}>{t("Повторить загрузку")}</button></div> : orders.length === 0 ? <div className="empty-state"><ClipboardList size={40} strokeWidth={1.2}/><h2>{t("Первая заявка уже близко")}</h2><p>{t("Начните с выбора подходящей упаковки.")}</p><button className="button blue" onClick={() => navigate("home", "catalog")}>{t("Открыть каталог ")}<ArrowRight size={18}/></button></div> : <div className="orders-list">{orders.map(o => <article className="saved-order" key={o.id}><div className="saved-order-top"><div><b>{o.number}</b><span>{new Date(o.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US", { timeZone: "Asia/Tashkent", day: "numeric", month: "long", year: "numeric" })}</span></div><span className="status-badge"><span />{o.status === "pending" ? t("На согласовании") : t("Заявка сохранена")}</span></div>{o.items.map(i => <div className="saved-order-item" key={i.id}><Package size={19}/><b>{t(i.name)}</b><span>{formatItemDimensions(i,lang)} · {i.thickness}{t(" мкм \u00B7 ")}{t(i.colorName)}{i.purpose && <em className="purpose-text"> · {i.purpose}</em>}{typeof i.lineTotal === "number" && <em className="saved-line-cost"> · {money(i.lineTotal)}</em>}</span><strong>{formatWeight(i.quantity)}{t(" кг")}</strong></div>)}<div className="saved-order-bottom"><p><MapPin size={16}/>{o.delivery.method === "delivery" ? `${o.delivery.city}, ${o.delivery.address}` : t("Самовывоз \u2014 по согласованию")}</p><a className="text-link" href={`https://t.me/easyplast?text=${encodeURIComponent(orderText(o, lang))}`} target="_blank" rel="noreferrer"><Send size={15}/>{t("Обсудить в Telegram")}</a></div><button className="text-link repeat-order" onClick={() => { if (cart.length + o.items.length > 30) {
        notify(t("В заявке может быть до 30 позиций."));
        return;
    } setCart(c => [...c, ...o.items.map(i => ({ ...i, id: makeId(), unitPrice: undefined, lineTotal: undefined }))]); notify(t("Параметры добавлены в новую заявку")); navigate("cart"); }}>{t("Повторить заявку ")}<ArrowRight size={15}/></button></article>)}</div>}</>}</section>}
    </main>
    <AssistantWidget />
    <footer className="site-footer"><div className="shell"><div className="footer-top"><div><button className="brand" onClick={() => navigate("home")}><span className="brand-icon"><i /><i /><i /></span><span>easy<span className="brand-light">plast</span><span className="brand-dot">.</span></span></button><p>{brandCopy.footer}</p></div><div className="footer-catalog"><span>{t("ПРОДУКЦИЯ")}</span>{products.map(p => <button key={p.key} onClick={() => configure(p)}>{t(p.name)}</button>)}</div><div className="footer-contact"><span>{t("СВЯЗАТЬСЯ С НАМИ")}</span><a href="tel:+998998705300">+998 99 870 53 00</a><a href="tel:+998909875300">+998 90 987 53 00</a><a href="https://t.me/easyplast" target="_blank" rel="noreferrer" className="telegram-link"><Send size={15}/>@easyplast <ArrowUpRight size={15}/></a></div><div className="footer-custom"><span>{t("ЕСТЬ СВОЯ ИДЕЯ?")}</span><button className="footer-create" onClick={() => configure(customProduct)}>{t("Давайте")}<br />{t("упакуем её. ")}<ArrowUpRight size={26}/></button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Easy Plast</span><a href="./privacy.html">{t("Обработка данных")}</a><span>{t("Сделано под ваш размер.")}</span></div></div></footer>
    <div className={`toast ${toast ? "visible" : ""}`} role="status"><CheckCircle2 size={19}/><span>{t(toast)}</span>{cart.length > 0 && <button onClick={() => { navigate("cart"); setToast(""); }}>{t("К заявке ")}<ArrowRight size={15}/></button>}<button aria-label={t("Закрыть уведомление")} onClick={() => setToast("")}><X size={16}/></button></div>
    <dialog className="auth-dialog" ref={authDialog} onCancel={() => setAuthOpen(false)} onClick={e => { if (e.target === e.currentTarget)
        setAuthOpen(false); }}><div className="auth-content"><button className="dialog-close" aria-label={t("Закрыть окно входа")} onClick={() => setAuthOpen(false)}><X size={21}/></button><span className="auth-symbol"><UserRound size={26}/></span><h2>{t("Ваша упаковка.")}<br />{t("Ваш аккаунт.")}</h2><p>{t("Войдите через Google, чтобы сохранить")}<br />{t("заявки и историю заказов.")}</p><GoogleSignIn active={authOpen} onSuccess={u => { setUser(u); setAuthOpen(false); if (!delivery.name && !u.displayName.includes("@"))
        setDelivery(d => ({ ...d, name: u.displayName })); notify(t("Вы вошли через Google")); }}/></div></dialog>
  </>;
}
