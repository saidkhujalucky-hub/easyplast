// Cloudflare Pages Function. Bind Workers AI as AI in the Pages dashboard.
export async function onRequestPost({request, env}) {
  if (!env.AI) return Response.json({error:'unavailable'}, {status:503});
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({error:'forbidden'}, {status:403});
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'invalid'}, {status:400});
  if (Number(request.headers.get('content-length') || 0) > 4096) return Response.json({error:'too large'}, {status:413});
  try {
    const text = await request.text(); if (text.length > 4096) return Response.json({error:'too large'}, {status:413});
    const {message, lang} = JSON.parse(text);
    if (typeof message !== 'string' || !message.trim() || message.length > 600 || !['ru','uz','en'].includes(lang)) return Response.json({error:'invalid'}, {status:400});
    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {messages:[{role:'system',content:'You are the Easy Plast packaging assistant. Answer briefly in the requested language. Use only these facts: Easy Plast makes polyethylene packaging for carpets, cookies, 19-liter water bottles, broccoli, shopping and garbage bags. Custom sizes, colors and printing can be discussed. Minimum order is 20 kg. Recommended thickness is 5 microns. Contact +998 99 870 53 00 or Telegram @easyplast. Do not invent prices, certifications, stock, delivery terms or technical guarantees. When unsure refer to a manager. Never ask for personal information.'},{role:'user',content:`Language: ${lang}. Question: ${message}`}],max_tokens:250});
    if (typeof result?.response !== 'string') throw new Error('empty');
    return Response.json({answer:result.response}, {headers:{'Cache-Control':'no-store'}});
  } catch { return Response.json({error:'unavailable'}, {status:503}); }
}
