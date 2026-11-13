"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import {translate,type Language,isLanguage} from "./messages";
const LanguageContext=createContext<{lang:Language;setLang:(lang:Language)=>void;t:(text:string)=>string}>({lang:"ru",setLang:()=>{},t:text=>text});
export function LanguageProvider({children}:{children:ReactNode}) {
  const [lang,setLang]=useState<Language>("ru"),[loaded,setLoaded]=useState(false);
  useEffect(()=>{try{const saved=localStorage.getItem("ep-language");if(isLanguage(saved))setLang(saved);}catch{}setLoaded(true);},[]);
  useEffect(()=>{document.documentElement.lang=lang;document.title=translate("Easy Plast — упаковка под ваш размер",lang);if(loaded)try{localStorage.setItem("ep-language",lang);document.cookie=`ep_language=${lang}; Path=/; SameSite=Lax; Max-Age=31536000; Secure`;}catch{}},[lang,loaded]);
  const value=useMemo(()=>({lang,setLang,t:(text:string)=>translate(text,lang)}),[lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useI18n(){return useContext(LanguageContext);}
export function LanguageSwitcher(){const {lang,setLang,t}=useI18n();return <div className="language-switch" role="group" aria-label={t("Язык сайта")}>{(["ru","uz","en"] as const).map(code=><button type="button" key={code} aria-pressed={lang===code} onClick={()=>setLang(code)}>{code.toUpperCase()}</button>)}</div>;}
