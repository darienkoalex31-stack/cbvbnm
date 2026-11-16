const { chromium } = require('/opt/node-tools/node_modules/playwright');
// Uso: NODE_USE_ENV_PROXY=1 node genera-annunci-v2.js <cartella-output> [nome1,nome2]
const OUT = process.argv[2], ONLY = process.argv[3];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const LOGO = `<svg viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="16" fill="#4B2F63"/><path d="M40 14v24.5a7 7 0 1 1-4-6.3V21l-12 3v18.5a7 7 0 1 1-4-6.3V20z" fill="#F7E6DF"/><path d="M50 12c2.5 2.5 2.5 6 0 8.5M54 9c4 4 4 10.5 0 14.5" stroke="#E3A93B" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
const SEAL = s => `<svg viewBox="0 0 120 120" width="${s}" height="${s}"><circle cx="60" cy="60" r="56" fill="#D2553F"/><circle cx="60" cy="60" r="47" fill="none" stroke="#FFD9A0" stroke-width="1.6" stroke-dasharray="3 4"/><path id="sa${s}" d="M29.69 77.5 A35 35 0 1 1 90.31 77.5" fill="none"/><text font-family="DM Sans, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#fff"><textPath href="#sa${s}" startOffset="50%" text-anchor="middle">GARANZIA PELLE D’OCA</textPath></text><path d="M60 86c-12-8-22-15.5-22-25.5 0-6.3 4.8-10.5 10.4-10.5 4.8 0 8.4 2.8 11.6 7 3.2-4.2 6.8-7 11.6-7 5.6 0 10.4 4.2 10.4 10.5 0 10-10 17.5-22 25.5z" fill="#FFD9A0"/></svg>`;
const BRAND = dark => `<div class="brand ${dark ? 'on-dark' : ''}">${LOGO}<span>Il Dono delle Note</span></div>`;
const PLUM_BG = 'background:radial-gradient(900px 600px at 85% 10%,rgba(227,169,59,.28),transparent 60%),radial-gradient(800px 700px at 0% 100%,rgba(210,85,63,.32),transparent 60%),linear-gradient(160deg,#3E2553,#4B2F63 50%,#6B4A87)';
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:'DM Sans',sans-serif;color:#2E2340;background:#FBF6EF}
.wrap{position:absolute;inset:0;padding:var(--pad);display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-family:'Fraunces',serif;font-weight:600;font-size:40px;color:#4B2F63}
.brand.on-dark{color:#fff}
h1{font-family:'Fraunces',serif;font-weight:600;letter-spacing:-.02em;line-height:1.05;font-size:var(--h1)}
h1 em{font-style:italic;font-weight:500;color:#D2553F}
.dark h1{color:#fff}.dark h1 em{color:#FFD9A0}
.sub{font-size:38px;line-height:1.32;color:#4A3F5C}
.dark .sub{color:rgba(255,255,255,.86)}
.pill{display:inline-flex;align-items:center;background:#D2553F;color:#fff;font-weight:700;font-size:36px;padding:22px 38px;border-radius:999px;align-self:flex-start}
.pill.center{align-self:center}
.spacer{flex:1}
.gap{height:var(--gap)}
.panel{background:#fff;border:1px solid #EADFD6;border-radius:36px;padding:40px 44px;box-shadow:0 30px 70px -40px rgba(46,35,64,.45)}
.dark .panel{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);box-shadow:none;color:#fff}
.kick{font-size:22px;letter-spacing:.16em;font-weight:700;color:#B8432F}
.serif{font-family:'Fraunces',serif}
.num{flex:none;width:72px;height:72px;border-radius:50%;background:#4B2F63;color:#fff;display:grid;place-items:center;font-family:'Fraunces',serif;font-weight:600;font-size:36px}
.row{display:flex;gap:28px;align-items:center}
.li{font-size:38px;line-height:1.25}
.li s{text-decoration-thickness:4px;text-decoration-color:#D2553F}
.chk{flex:none;width:56px;height:56px;border-radius:50%;background:#E8F3EC;display:grid;place-items:center}
.lyric{font-family:'Fraunces',serif;font-size:40px;line-height:1.35}
.lyric em{font-style:italic;color:#D2553F}
.dark .lyric em{color:#FFD9A0}
`;
const CHECK = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2E7D4F" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const page = (story, body, dark, bg) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet"><style>:root{--w:1080px;--h:${story ? 1920 : 1350}px;--pad:${story ? '230px 80px 330px' : '72px 80px 72px'};--h1:${story ? 100 : 86}px;--gap:${story ? 64 : 40}px}${CSS}</style></head><body><div class="wrap ${dark ? 'dark' : ''}" style="${bg || ''}">${body}</div></body></html>`;


// ---- v2: pubblico freddo, 6 corpi x 3 hook, senza prezzo (📖 GOATed Ads p.5-11, Hooks p.4-5) ----
const NEXT = (dark) => `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start"><span class="pill">Fai il quiz gratis →</span><span style="font-size:28px;color:${dark ? 'rgba(255,255,255,.85)' : '#4A3F5C'}">2 minuti · vedi subito il titolo della sua canzone</span></div>`;
const ricordo = (h, sub) => s => page(s, `${BRAND(true)}<div class="spacer"></div>
    <h1>${h}</h1><div class="gap"></div>
    <p class="sub" style="font-size:${s ? 42 : 44}px">${sub}</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ <em>Giulia</em>, un giorno sarai grande<br>e questa canzone sarà ancora tua ♪</div>
    <div class="gap"></div>${NEXT(true)}`, true, PLUM_BG);
const dimenticati = (h) => s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>${h}</h1>
    <div class="gap"></div>
    <div style="display:flex;flex-direction:column;gap:30px">
      <div class="row"><div class="num">1</div><div class="li"><s>L’ennesimo giocattolo</s></div></div>
      <div class="row"><div class="num">2</div><div class="li"><s>Il vestito della taglia giusta, per un mese</s></div></div>
      <div class="row"><div class="num">3</div><div class="li"><s>Il buono regalo dentro una busta</s></div></div>
    </div>
    <div class="spacer"></div>
    <div class="panel" style="border:3px solid #D2553F"><div class="kick">QUELLO CHE RICORDERÀ</div><div class="serif" style="font-size:52px;font-weight:600;line-height:1.15;margin-top:12px">Una canzone con <em style="color:#D2553F;font-weight:500">il suo nome</em>, scritta solo per lui.</div></div>
    <div class="spacer"></div>${NEXT(false)}`);
const senza = (h) => s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>${h}</h1>
    <div class="spacer"></div>
    <div style="display:flex;flex-direction:column;gap:28px">
      <div class="row"><div class="num">1</div><div class="li">Rispondi a 10 domande su di lui</div></div>
      <div class="row"><div class="num">2</div><div class="li">Approvi il testo su WhatsApp</div></div>
      <div class="row"><div class="num">3</div><div class="li">Ricevi la canzone, pronta da regalare</div></div>
    </div>
    <div class="spacer"></div>${NEXT(false)}`);
const natale = (h, sub) => s => page(s, `${BRAND(true)}<div class="gap"></div>
    <span style="align-self:flex-start;font-weight:700;letter-spacing:.16em;font-size:26px;color:#2E2340;background:#E3A93B;padding:12px 24px;border-radius:999px">ORDINA ENTRO IL 15 DICEMBRE</span><div class="gap" style="height:28px"></div>
    <h1>${h}</h1><div class="gap" style="height:28px"></div>
    <p class="sub">${sub}</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ <em>Leonardo</em>, la notte di Natale<br>la stella più grande sei tu ♪</div>
    <div class="gap"></div>${NEXT(true)}`, true, PLUM_BG);
const ore48 = (h, sub) => s => page(s, `${BRAND(true)}<div class="gap"></div>
    <span style="align-self:flex-start;font-weight:700;letter-spacing:.16em;font-size:26px;color:#2E2340;background:#E3A93B;padding:12px 24px;border-radius:999px">CONSEGNA PRIORITARIA</span><div class="gap" style="height:28px"></div>
    <h1>${h}</h1><div class="gap" style="height:28px"></div>
    <p class="sub">${sub}</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ Tanti auguri, <em>Tommaso</em>,<br>oggi il mondo è tutto per te ♪</div>
    <div class="gap"></div>${NEXT(true)}`, true, PLUM_BG);
const titolo = (h) => s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>${h}</h1><div class="gap" style="height:24px"></div>
    <p class="sub">Rispondi a 10 domande su di lui: in 2 minuti vedi il titolo della sua canzone, prima di decidere se ordinarla.</p>
    <div class="spacer"></div>
    <div class="panel"><div class="kick">TITOLO PROVVISORIO</div><div class="serif" style="font-size:60px;font-weight:600;line-height:1.1;margin-top:14px">« Sempre accanto a te, <em style="color:#D2553F;font-weight:500">Leonardo</em> »</div><div style="font-size:28px;color:#7A6F86;margin-top:18px">Ballata · Natale · da parte della mamma</div></div>
    <div class="spacer"></div><span class="pill">Scopri il titolo gratis →</span>`);
const ads = {
  'v2-ricordo-a': ricordo('Ti ricordi cosa ti hanno regalato <em>a 6&nbsp;anni?</em>', 'Probabilmente no. Ma una canzone con il tuo nome te la ricorderesti ancora.'),
  'v2-ricordo-b': ricordo('Tra vent’anni ricorderà <em>un solo regalo di&nbsp;quest’anno.</em>', 'Non sarà un giocattolo. Sarà la canzone con il suo&nbsp;nome.'),
  'v2-ricordo-c': ricordo('Quanti regali dell’anno scorso <em>usa ancora tuo&nbsp;figlio?</em>', 'Una canzone con il suo nome non si rompe, non va fuori taglia, non si dimentica.'),
  'v2-dimenticati-a': dimenticati('3 regali che a gennaio avrà <em>già dimenticato</em>'),
  'v2-dimenticati-b': dimenticati('Mamme, quest’anno <em>niente regali da&nbsp;cassetto</em>'),
  'v2-dimenticati-c': dimenticati('Ha già tutto? <em>Regalagli una cosa che non esiste&nbsp;ancora.</em>'),
  'v2-senza-a': senza('Come regalargli una canzone tutta sua, <em>anche se non sai né scrivere né&nbsp;cantare</em>'),
  'v2-senza-b': senza('Una canzone con il suo nome, <em>in 3 passi, da&nbsp;casa</em>'),
  'v2-senza-c': senza('Il modo più semplice per regalargli <em>una canzone tutta&nbsp;sua</em>'),
  'v2-natale-a': natale('Il regalo di Natale che <em>non finisce in un&nbsp;cassetto</em>', 'Una canzone scritta solo per tuo figlio, con il suo nome e i vostri ricordi.'),
  'v2-natale-b': natale('Quest’anno sotto l’albero, <em>il suo nome in una&nbsp;canzone</em>', 'La ascolterà a Natale. E la riascolterà da grande.'),
  'v2-natale-c': natale('Mamme, il regalo di Natale <em>si prenota entro il&nbsp;15/12</em>', 'Una canzone con il suo nome. Il testo lo approvi tu su WhatsApp.'),
  'v2-48ore-a': ore48('Compleanno tra pochi giorni? <em>La sua canzone in&nbsp;48&nbsp;ore.</em>', 'Approvi il testo su WhatsApp, e in 48 ore hai la canzone pronta da regalare.'),
  'v2-48ore-b': ore48('Regalo dell’ultimo minuto? <em>Che sembri pensato da&nbsp;mesi.</em>', 'Una canzone con il suo nome. Consegna in 48 ore da quando approvi il testo.'),
  'v2-48ore-c': ore48('Festa in arrivo e ancora niente regalo? <em>Ce&nbsp;la&nbsp;facciamo.</em>', 'Testo su WhatsApp entro 24 ore dall’ordine. Canzone in 48 ore dal tuo OK.'),
  'v2-titolo-a': titolo('Scopri <em>gratis</em> il titolo della canzone di&nbsp;tuo&nbsp;figlio'),
  'v2-titolo-b': titolo('Mamme, ho un regalo per voi 🎁 <em>il titolo della sua canzone, gratis</em>'),
  'v2-titolo-c': titolo('Come si chiamerebbe <em>la canzone di tuo&nbsp;figlio?</em>'),

};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ userAgent: UA, deviceScaleFactor: 1 });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, async r => {
    try { const res = await fetch(r.request().url(), {headers:{'user-agent': UA}});
      r.fulfill({status: res.status, headers: {'content-type': res.headers.get('content-type') || 'text/css', 'access-control-allow-origin':'*'}, body: Buffer.from(await res.arrayBuffer())});
    } catch(e) { r.abort(); }
  });
  for (const [name, make] of Object.entries(ads)) {
    if (ONLY && !ONLY.split(',').includes(name)) continue;
    for (const story of [false, true]) {
      const h = story ? 1920 : 1350;
      const p = await ctx.newPage(); await p.setViewportSize({width:1080, height:h});
      await p.setContent(make(story), {waitUntil:'networkidle'});
      await p.evaluate(() => document.fonts.ready);
      const over = await p.evaluate(h => { const w = document.querySelector('.wrap'); const pad = h > 1500 ? 1590 : 1290; return [...w.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > 1001 || r.bottom > pad); }).map(e => (e.className && e.className.baseVal === undefined ? e.className : e.tagName) + '@' + Math.round(e.getBoundingClientRect().bottom)).slice(0, 4); }, h);
      await p.screenshot({path: `${OUT}/annuncio-${name}-${story ? 'storia-1080x1920' : 'post-1080x1350'}.png`});
      console.log(name, story ? 'storia' : 'post', over.length ? 'FUORI: ' + over.join(', ') : 'ok');
      await p.close();
    }
  }
  await b.close();
})();
