import {useEffect, useState} from 'react';
import {Moon, Sun} from 'lucide-react';
import {useI18n} from './I18n';

export default function ThemeSwitch() {
  const {lang} = useI18n();
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('ep-theme') === 'dark'; } catch { return false; } });
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('ep-theme', dark ? 'dark' : 'light'); } catch {} }, [dark]);
  const label = dark ? {ru:'Светлая тема',uz:'Yorug‘ mavzu',en:'Light theme'}[lang] : {ru:'Тёмная тема',uz:'Qorong‘i mavzu',en:'Dark theme'}[lang];
  return <button className="ep-theme-switch" type="button" aria-label={label} title={label} onClick={() => setDark(!dark)}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>;
}
