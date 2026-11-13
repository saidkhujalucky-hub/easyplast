"use client";
import { useI18n } from "./I18n";
import {apiFetch,externalApi,rememberApiSession} from "./api-client";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Phone, Send } from "lucide-react";
type GoogleIdentity = {
    initialize: (config: {
        client_id: string;
        nonce: string;
        callback: (r: {
            credential: string;
        }) => void;
        auto_select: boolean;
        ux_mode: string;
    }) => void;
    renderButton: (node: HTMLElement, options: Record<string, unknown>) => void;
    disableAutoSelect: () => void;
};
declare global {
    interface Window {
        google?: {
            accounts: {
                id: GoogleIdentity;
            };
        };
    }
}
let library: Promise<void> | null = null;
function loadLibrary() {
    if (window.google?.accounts.id)
        return Promise.resolve();
    if (library)
        return library;
    library = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        const timeout = window.setTimeout(() => reject(new Error("Google не отвечает. Проверьте соединение и попробуйте ещё раз.")), 15000);
        script.onload = () => { clearTimeout(timeout); resolve(); };
        script.onerror = () => { clearTimeout(timeout); reject(new Error("Не удалось загрузить Google. Проверьте соединение.")); };
        document.head.appendChild(script);
    }).catch(e => { library = null; throw e; });
    return library;
}
export default function GoogleSignIn({ active, onSuccess }: {
    active: boolean;
    onSuccess: (user: {
        displayName: string;
        email: string;
    }) => void;
}) {
    const { lang, t } = useI18n();
    const host = useRef<HTMLDivElement>(null), onSuccessRef = useRef(onSuccess), cached = useRef<{
        clientId: string;
        nonce: string;
        time: number;
    } | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "unconfigured" | "error" | "signing">("loading"), [error, setError] = useState(""), [attempt, setAttempt] = useState(0);
    onSuccessRef.current = onSuccess;
    useEffect(() => {
        if (!active)
            return;
        let cancelled = false;
        async function start() {
            setState("loading");
            setError("");
            try {
                if (!cached.current || Date.now() - cached.current.time > 8 * 60000) {
                    const res = await apiFetch("/api/auth/config", { cache: "no-store" });
                    if (!res.ok)
                        throw new Error("Вход временно недоступен.");
                    const c = await res.json() as {
                        configured: boolean;
                        clientId: string;
                        nonce: string;
                    };
                    if (!c.configured) {
                        if (!cancelled)
                            setState("unconfigured");
                        return;
                    }
                    const config = { clientId: c.clientId, nonce: c.nonce, time: Date.now() };
                    await loadLibrary();
                    if (cancelled)
                        return;
                    cached.current = config;
                    window.google!.accounts.id.initialize({ client_id: config.clientId, nonce: config.nonce, auto_select: false, ux_mode: "popup", callback: async ({ credential }) => {
                            setState("signing");
                            setError("");
                            try {
                                const r = await apiFetch("/api/auth/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential, nonce: config.nonce }) });
                                const data = await r.json() as {
                                    sessionToken?:string;
                                    expiresAt?:number;
                                    user: {
                                        displayName: string;
                                        email: string;
                                    };
                                    error?: string;
                                };
                                if (!r.ok)
                                    throw new Error(data.error || "Не удалось войти.");
                                if(externalApi()){
                                    if(!data.sessionToken||!data.expiresAt)throw new Error("Не удалось войти.");
                                    rememberApiSession(data.sessionToken,data.expiresAt);
                                }
                                cached.current = null;
                                onSuccessRef.current(data.user);
                            }
                            catch (e) {
                                setError(e instanceof Error ? e.message : "Не удалось войти.");
                                setState("error");
                                cached.current = null;
                            }
                        } });
                }
                if (cancelled)
                    return;
                setState("ready");
                if (host.current) {
                    host.current.replaceChildren();
                    window.google!.accounts.id.renderButton(host.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "signin_with", width: Math.min(340, window.innerWidth - 100), locale: lang });
                }
            }
            catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Не удалось открыть вход Google.");
                    setState("error");
                }
            }
        }
        void start();
        return () => { cancelled = true; };
    }, [active, attempt, lang]);
    return <div className="google-auth">
    {(state === "loading" || state === "signing") && <p className="loading-line"><LoaderCircle className="spin" size={20}/>{state === "signing" ? t("Подтверждаем вход\u2026") : t("Подключаем Google\u2026")}</p>}
    <div ref={host} className={state === "ready" ? "google-button" : "hidden"}/>
    {state === "unconfigured" && <div className="auth-unavailable"><p><b>{t("Вход через Google пока не подключён")}</b></p><p>{t("Пока вы можете собрать заявку и передать её менеджеру в Telegram.")}</p><a className="button dark" href="https://t.me/easyplast" target="_blank" rel="noreferrer"><Send size={17}/>@easyplast</a></div>}
    {state === "error" && <div className="form-error" role="alert"><p>{t(error)}</p><button className="text-link" onClick={() => setAttempt(x => x + 1)}>{t("Попробовать ещё раз")}</button></div>}
    <p className="fineprint">{t("Для входа используйте свой аккаунт Google. Мы получим имя и email. ")}<a href="./privacy.html">{t("Обработка данных")}</a></p>
  </div>;
}
