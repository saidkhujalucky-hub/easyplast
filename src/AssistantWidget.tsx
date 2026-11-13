import {useState, type FormEvent} from 'react';
import {MessageCircle, X, Send} from 'lucide-react';
import {useI18n} from './I18n';

const copy = {
  ru:{title:'ИИ-помощник', intro:'Здравствуйте! Помогу с выбором упаковки. Что вас интересует?', placeholder:'Ваш вопрос об упаковке', send:'Отправить', close:'Закрыть чат', error:'Сейчас помощник недоступен. Напишите нам в Telegram или позвоните.', note:'Не отправляйте личные данные. Ответы ИИ могут содержать ошибки.'},
  uz:{title:'AI yordamchi', intro:'Assalomu alaykum! Qadoq tanlashda yordam beraman. Savolingiz qanday?', placeholder:'Qadoq haqida savolingiz', send:'Yuborish', close:'Chatni yopish', error:'Yordamchi hozir ishlamayapti. Telegram orqali yozing yoki qo‘ng‘iroq qiling.', note:'Shaxsiy ma’lumot yubormang. AI javoblarida xato bo‘lishi mumkin.'},
  en:{title:'AI assistant', intro:'Hello! I can help you choose packaging. What would you like to know?', placeholder:'Ask about packaging', send:'Send', close:'Close chat', error:'The assistant is unavailable. Please contact us by Telegram or phone.', note:'Please do not share personal information. AI answers may contain errors.'}
};
export default function AssistantWidget() {
  const {lang} = useI18n(); const c = copy[lang];
  const [open,setOpen] = useState(false), [question,setQuestion] = useState(''), [answer,setAnswer] = useState(''), [busy,setBusy] = useState(false);
  async function submit(e:FormEvent) { e.preventDefault(); const message=question.trim(); if(!message||busy)return; setBusy(true); setAnswer('');
    try { const response=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,lang})}); const data=await response.json(); if(!response.ok || typeof data.answer !== 'string') throw new Error(); setAnswer(data.answer); } catch { setAnswer(c.error); } finally {setBusy(false);} }
  return <div className="ep-assistant">{open && <section className="ep-chat" aria-label={c.title}><header><strong>{c.title}</strong><button aria-label={c.close} onClick={()=>setOpen(false)}><X size={18}/></button></header><div className="ep-chat-body" aria-live="polite"><p>{c.intro}</p>{answer && <p>{answer}</p>}</div><small>{c.note}</small><form onSubmit={submit}><input value={question} onChange={e=>setQuestion(e.target.value)} maxLength={600} placeholder={c.placeholder} aria-label={c.placeholder}/><button disabled={busy || !question.trim()} aria-label={c.send}><Send size={18}/></button></form></section>}<button className="ep-chat-toggle" aria-expanded={open} onClick={()=>setOpen(!open)}>{open ? <X size={20}/> : <MessageCircle size={20}/>} {c.title}</button></div>;
}
