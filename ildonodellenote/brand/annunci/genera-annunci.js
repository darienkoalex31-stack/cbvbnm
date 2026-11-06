const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = process.argv[2];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const LOGO = `<svg viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="16" fill="#4B2F63"/><path d="M40 14v24.5a7 7 0 1 1-4-6.3V21l-12 3v18.5a7 7 0 1 1-4-6.3V20z" fill="#F7E6DF"/><path d="M50 12c2.5 2.5 2.5 6 0 8.5M54 9c4 4 4 10.5 0 14.5" stroke="#E3A93B" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
const SEAL = s => `<svg viewBox="0 0 120 120" width="${s}" height="${s}"><circle cx="60" cy="60" r="56" fill="#D2553F"/><circle cx="60" cy="60" r="47" fill="none" stroke="#FFD9A0" stroke-width="1.6" stroke-dasharray="3 4"/><path id="sa${s}" d="M29.69 77.5 A35 35 0 1 1 90.31 77.5" fill="none"/><text font-family="DM Sans, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#fff"><textPath href="#sa${s}" startOffset="50%" text-anchor="middle">GARANZIA PELLE D’OCA</textPath></text><path d="M60 86c-12-8-22-15.5-22-25.5 0-6.3 4.8-10.5 10.4-10.5 4.8 0 8.4 2.8 11.6 7 3.2-4.2 6.8-7 11.6-7 5.6 0 10.4 4.2 10.4 10.5 0 10-10 17.5-22 25.5z" fill="#FFD9A0"/></svg>`;
const WAVE = n => Array.from({length:n}, (_, i) => `<i style="height:${22 + Math.abs(Math.sin(i * 1.7)) * 78}%"></i>`).join('');
const CARD = (name, l1, l2) => `<div class="card"><div class="card-top"><div class="vinyl"><div class="lab"></div></div><div><div class="kick">CANZONE PERSONALIZZATA</div><div class="ctitle">La canzone di <em>${name}</em></div><div class="meta">Ballata · voce femminile · 2:48</div></div></div><div class="lyr">♪ <em>${name}</em>, ${l1}<br>${l2} ♪</div><div class="wave">${WAVE(34)}</div></div>`;
const CARD_LIGHT = (name, l1, l2) => `<div class="card light"><div class="card-top"><div class="vinyl"><div class="lab"></div></div><div><div class="kick">CANZONE PERSONALIZZATA</div><div class="ctitle">La canzone di <em>${name}</em></div><div class="meta">Pop natalizio · voce femminile · 2:41</div></div></div><div class="lyr">♪ <em>${name}</em>, ${l1}<br>${l2} ♪</div></div>`;
const BRAND = (dark) => `<div class="brand ${dark ? 'on-dark' : ''}">${LOGO}<span>Il Dono delle Note</span></div>`;
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:W px;height:H px}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:'DM Sans',sans-serif;color:#2E2340;background:#FBF6EF;position:relative}
.wrap{position:absolute;inset:0;padding:var(--pad);display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-family:'Fraunces',serif;font-weight:600;font-size:40px;color:#4B2F63}
.brand.on-dark{color:#fff}
h1{font-family:'Fraunces',serif;font-weight:600;letter-spacing:-.02em;line-height:1.04}
h1 em{font-style:italic;font-weight:500;color:#D2553F}
.sub{font-size:40px;line-height:1.3;color:#4A3F5C}
.card{background:linear-gradient(150deg,#4B2F63,#6B4A87);border-radius:44px;padding:48px 52px;color:#fff;box-shadow:0 40px 80px -40px rgba(46,35,64,.6);position:relative;overflow:hidden}
.card:after{content:'';position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(227,169,59,.35),transparent 65%)}
.card-top{display:flex;gap:36px;align-items:center}
.vinyl{flex:none;width:170px;height:170px;border-radius:50%;background:repeating-radial-gradient(circle,#1d1426 0 3px,#2a1f36 3px 6px);display:grid;place-items:center}
.vinyl .lab{width:60px;height:60px;border-radius:50%;background:#D2553F;border:8px solid #FFD9A0}
.kick{font-size:22px;letter-spacing:.16em;font-weight:700;opacity:.75}
.ctitle{font-family:'Fraunces',serif;font-size:58px;font-weight:600;line-height:1.05;margin-top:6px}
.ctitle em,.lyr em{color:#FFD9A0;font-style:italic;font-weight:500}
.meta{font-size:24px;opacity:.75;margin-top:6px}
.lyr{margin-top:34px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:26px;padding:30px 34px;font-family:'Fraunces',serif;font-size:38px;line-height:1.35}
.wave{display:flex;gap:9px;align-items:center;height:70px;margin-top:30px;position:relative;z-index:1}
.wave i{display:block;width:10px;border-radius:10px;background:rgba(255,255,255,.7)}
.pill{display:inline-flex;align-items:center;gap:14px;background:#D2553F;color:#fff;font-weight:700;font-size:38px;padding:24px 40px;border-radius:999px}
.guar{display:flex;align-items:center;gap:22px;font-size:32px;line-height:1.25;color:#4A3F5C}
.guar b{color:#2E2340}
.spacer{flex:1}
.card.light{background:#FBF6EF;color:#2E2340;box-shadow:0 40px 90px -40px rgba(0,0,0,.6)}
.card.light:after{background:radial-gradient(circle,rgba(227,169,59,.28),transparent 65%)}
.card.light .ctitle em,.card.light .lyr em{color:#D2553F}
.card.light .lyr{background:rgba(75,47,99,.06);border-color:rgba(75,47,99,.14)}
`;
function page(w, h, body, extraCss) {
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet"><style>:root{--w:${w}px;--h:${h}px;--pad:${h > 1500 ? '230px 80px 330px' : '72px 80px 72px'}}${CSS}${extraCss || ''}</style></head><body>${body}</body></html>`;
}
const creatives = {
  // 1. Il nome cantato: il prodotto in primo piano
  nome: (story) => page(1080, story ? 1920 : 1350, `<div class="wrap">${BRAND(false)}
    <h1 style="font-size:${story ? 100 : 88}px;margin-top:${story ? 60 : 44}px">Regala a tuo figlio <em>una canzone tutta sua</em></h1>
    <p class="sub" style="margin-top:24px">Con il suo nome, le sue passioni e i vostri ricordi.</p>
    <div style="margin-top:${story ? 70 : 44}px">${CARD('Sofia', 'piccola stella mia,', 'quando ridi si accende la via')}</div>
    <div class="spacer"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:24px;${story ? 'flex-direction:column;align-items:flex-start;gap:36px' : ''}"><span class="pill">Quiz di 2 minuti · da 25 €</span><div class="guar">${SEAL(104)}<span><b>Garanzia<br>Pelle d’Oca</b></span></div></div>
  </div>`),
  // 2. Natale: stagione e scadenza
  natale: (story) => page(1080, story ? 1920 : 1350, `<div class="wrap" style="background:radial-gradient(900px 600px at 85% 10%,rgba(227,169,59,.30),transparent 60%),radial-gradient(800px 700px at 0% 100%,rgba(210,85,63,.35),transparent 60%),linear-gradient(160deg,#3E2553,#4B2F63 50%,#6B4A87)">${BRAND(true)}
    <div style="margin-top:${story ? 70 : 46}px"><span style="display:inline-block;font-weight:700;letter-spacing:.18em;font-size:26px;color:#2E2340;background:#E3A93B;padding:12px 24px;border-radius:999px">SPECIALE NATALE</span></div>
    <h1 style="font-size:${story ? 104 : 92}px;margin-top:28px;color:#fff">Il regalo di Natale che <em style="color:#FFD9A0">non finisce in un cassetto</em></h1>
    <p class="sub" style="margin-top:26px;color:rgba(255,255,255,.85)">Una canzone scritta solo per tuo figlio, con il suo nome.</p>
    <div style="margin-top:${story ? 80 : 46}px">${CARD_LIGHT('Leonardo', 'sotto l’albero c’è', 'una canzone che parla di te')}</div>
    <div class="spacer"></div>
    <div style="display:flex;align-items:center;gap:26px;margin-top:${story ? 60 : 40}px;${story ? 'flex-direction:column;align-items:flex-start' : ''}"><span class="pill">Ordina entro il 15 dicembre</span><span style="font-size:32px;color:rgba(255,255,255,.85)">da 25 € · quiz di 2 minuti</span></div>
  </div>`),
  // 3. Garanzia: il rischio lo prendiamo noi
  garanzia: (story) => page(1080, story ? 1920 : 1350, `<div class="wrap">${BRAND(false)}
    <div class="spacer"></div>
    <div style="display:flex;justify-content:center">${SEAL(story ? 330 : 280)}</div>
    <h1 style="font-size:${story ? 98 : 88}px;margin-top:${story ? 60 : 44}px;text-align:center">Se non ti viene la pelle d’oca, <em>ti ridiamo i soldi.</em><br>E 5 € in più.</h1>
    <p class="sub" style="margin-top:30px;text-align:center">Basta scriverci «rivoglio i soldi» entro 14 giorni.<br>Nessuna domanda.</p>
    <div class="spacer"></div>
    <div style="display:flex;justify-content:center"><span class="pill">Una canzone con il suo nome · da 25 €</span></div>
  </div>`),
};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ userAgent: UA, deviceScaleFactor: 1 });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, async r => {
    try { const res = await fetch(r.request().url(), {headers:{'user-agent': UA}});
      r.fulfill({status: res.status, headers: {'content-type': res.headers.get('content-type') || 'text/css', 'access-control-allow-origin':'*'}, body: Buffer.from(await res.arrayBuffer())});
    } catch(e) { r.abort(); }
  });
  for (const [name, make] of Object.entries(creatives)) {
    for (const story of [false, true]) {
      const h = story ? 1920 : 1350;
      const p = await ctx.newPage(); await p.setViewportSize({width:1080, height:h});
      await p.setContent(make(story), {waitUntil:'networkidle'});
      await p.evaluate(() => document.fonts.ready);
      const over = await p.evaluate(() => { const w = document.querySelector('.wrap'); return [...w.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.right > 1081 || r.bottom > innerHeight + 1; }).map(e => e.className || e.tagName).slice(0,5); });
      const file = `${OUT}/annuncio-${name}-${story ? 'storia-1080x1920' : 'post-1080x1350'}.png`;
      await p.screenshot({path: file});
      console.log(file.split('/').pop(), over.length ? 'FUORI: ' + over.join(',') : 'ok');
      await p.close();
    }
  }
  await b.close();
})();
