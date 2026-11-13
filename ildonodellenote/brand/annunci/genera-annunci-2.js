const { chromium } = require('/opt/node-tools/node_modules/playwright');
// Uso: NODE_USE_ENV_PROXY=1 node genera-annunci-2.js <cartella-output> [nome1,nome2]
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

const ads = {
  // Lead magnet "strumento": il quiz restituisce il titolo della sua canzone
  titolo: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Scopri <em>gratis</em> il titolo della canzone di&nbsp;tuo&nbsp;figlio</h1><div class="gap" style="height:24px"></div>
    <p class="sub">Rispondi a 10 domande su di lui: in 2 minuti vedi il titolo della sua canzone, prima di decidere se ordinarla.</p>
    <div class="spacer"></div>
    <div class="panel"><div class="kick">TITOLO PROVVISORIO</div><div class="serif" style="font-size:60px;font-weight:600;line-height:1.1;margin-top:14px">« Sempre accanto a te, <em style="color:#D2553F;font-weight:500">Leonardo</em> »</div><div style="font-size:28px;color:#7A6F86;margin-top:18px">Ballata · Natale · da parte della mamma</div></div>
    <div class="spacer"></div><span class="pill">Fai il quiz gratis →</span>`),
  // Dimostrazione del processo: il testo arriva su WhatsApp e lo approvi tu
  whatsapp: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Il testo arriva su WhatsApp. <em>Lo&nbsp;approvi&nbsp;tu.</em></h1><div class="gap" style="height:24px"></div>
    <p class="sub">Solo dopo il tuo OK diventa una canzone.</p>
    <div class="spacer"></div>
    <div style="background:#ECE5DD;border-radius:36px;overflow:hidden;box-shadow:0 30px 70px -40px rgba(46,35,64,.45)">
      <div style="background:#075E54;color:#fff;padding:22px 32px;font-size:30px;font-weight:700;display:flex;justify-content:space-between"><span>Il Dono delle Note</span><span style="font-weight:400;opacity:.8;font-size:24px">esempio</span></div>
      <div style="padding:30px;display:flex;flex-direction:column;gap:18px">
        <div style="background:#fff;border-radius:22px;padding:22px 26px;max-width:84%;font-size:30px;line-height:1.35">Ecco il testo della canzone di Leonardo. Leggilo con calma: se ti piace, rispondi OK.</div>
        <div style="background:#fff;border-radius:22px;padding:22px 26px;max-width:84%" class="lyric"><span style="font-size:32px">♪ <em>Leonardo</em>, quando ridi tu<br>il mondo intero sorride di più ♪</span></div>
        <div style="background:#DCF8C6;border-radius:22px;padding:22px 26px;max-width:80%;align-self:flex-end;font-size:30px;line-height:1.35">Cambiamo solo il soprannome in Leo, poi OK!</div>
      </div></div>
    <div class="gap"></div><span class="pill">Inizia dal quiz gratis →</span>`),
  // Svelare un problema: i regali che verranno dimenticati
  dimenticati: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>3 regali che a gennaio avrà <em>già dimenticato</em></h1>
    <div class="gap"></div>
    <div style="display:flex;flex-direction:column;gap:30px">
      <div class="row"><div class="num">1</div><div class="li"><s>L’ennesimo giocattolo</s></div></div>
      <div class="row"><div class="num">2</div><div class="li"><s>Il vestito della taglia giusta, per un mese</s></div></div>
      <div class="row"><div class="num">3</div><div class="li"><s>Il buono regalo dentro una busta</s></div></div>
    </div>
    <div class="spacer"></div>
    <div class="panel" style="border:3px solid #D2553F"><div class="kick">QUELLO CHE RICORDERÀ</div><div class="serif" style="font-size:52px;font-weight:600;line-height:1.15;margin-top:12px">Una canzone con <em style="color:#D2553F;font-weight:500">il suo nome</em>, scritta solo per lui.</div></div>
    <div class="spacer"></div><span class="pill">Quiz gratis di 2 minuti →</span>`),
  // Svelare un problema con una domanda personale
  ricordo: s => page(s, `${BRAND(true)}<div class="spacer"></div>
    <h1>Ti ricordi cosa ti hanno regalato <em>a 6 anni?</em></h1><div class="gap"></div>
    <p class="sub" style="font-size:${s ? 42 : 44}px">Probabilmente no. Ma se qualcuno ti avesse scritto una canzone con il tuo nome, te la ricorderesti ancora.</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ <em>Giulia</em>, un giorno sarai grande<br>e questa canzone sarà ancora tua ♪</div>
    <div class="gap"></div><span class="pill">Crea la sua canzone · da 25 € →</span>`, true, PLUM_BG),
  // X errori
  errori: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>3 errori che fanno finire un regalo <em>in un cassetto</em></h1>
    <div class="gap"></div>
    <div style="display:flex;flex-direction:column;gap:30px">
      <div class="row"><div class="num" style="background:#D2553F">1</div><div class="li">Comprarlo all’ultimo minuto, come fanno tutti</div></div>
      <div class="row"><div class="num" style="background:#D2553F">2</div><div class="li">Pensare al prezzo invece che al ricordo</div></div>
      <div class="row"><div class="num" style="background:#D2553F">3</div><div class="li">Regalare una cosa che non parla di lui</div></div>
    </div>
    <div class="spacer"></div>
    <p class="sub" style="font-size:42px"><b style="color:#2E2340">La soluzione:</b> una canzone che esiste solo per lui, con il suo nome e i vostri ricordi.</p>
    <div class="gap"></div><span class="pill">Fai il quiz gratis →</span>`),
  // Numero + risultato + tempo
  numeri: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>10 domande. 2 minuti. <em>Una canzone con il&nbsp;suo&nbsp;nome.</em></h1>
    <div class="spacer"></div>
    <div style="display:flex;flex-direction:column;gap:26px">
      ${[['10', 'domande su di lui', 'nome, passioni, ricordi'], ['24', 'ore', 'il testo su WhatsApp, da approvare'], ['7', 'giorni', 'la canzone pronta da regalare']].map(([n, u, d]) => `<div class="panel row" style="padding:30px 40px"><div class="serif" style="font-size:96px;font-weight:600;color:#D2553F;width:150px;line-height:1">${n}</div><div><div style="font-size:40px;font-weight:700">${u}</div><div style="font-size:32px;color:#7A6F86;margin-top:4px">${d}</div></div></div>`).join('')}
    </div>
    <div class="spacer"></div><span class="pill">Inizia il quiz gratis →</span>`),
  // Urgenza reale: consegna prioritaria
  '48ore': s => page(s, `${BRAND(true)}<div class="gap"></div>
    <span style="align-self:flex-start;font-weight:700;letter-spacing:.16em;font-size:26px;color:#2E2340;background:#E3A93B;padding:12px 24px;border-radius:999px">CONSEGNA PRIORITARIA</span><div class="gap" style="height:28px"></div>
    <h1>Compleanno tra pochi giorni? <em>La sua canzone in&nbsp;48&nbsp;ore.</em></h1><div class="gap" style="height:28px"></div>
    <p class="sub">Approvi il testo su WhatsApp, e in 48 ore hai l’MP3 pronto da regalare. Solo 5 € in più.</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ Tanti auguri, <em>Tommaso</em>,<br>oggi il mondo è tutto per te ♪</div>
    <div class="gap"></div><span class="pill">Fai il quiz gratis →</span>`, true, PLUM_BG),
  // Come ottenere X anche se…
  'senza-saper-cantare': s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Come regalargli una canzone tutta sua, <em>anche se non sai né scrivere né&nbsp;cantare</em></h1>
    <div class="spacer"></div>
    <div style="display:flex;flex-direction:column;gap:28px">
      <div class="row"><div class="num">1</div><div class="li">Rispondi a 10 domande su di lui</div></div>
      <div class="row"><div class="num">2</div><div class="li">Approvi il testo su WhatsApp</div></div>
      <div class="row"><div class="num">3</div><div class="li">Ricevi la canzone, pronta da regalare</div></div>
    </div>
    <div class="spacer"></div><span class="pill">Inizia: 2 minuti, gratis →</span>`),
  // Aggettivo + cosa buona, con il prezzo
  '25euro': s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Il regalo più personale che puoi fare <em>con 25 €</em></h1>
    <div class="spacer"></div>
    <div class="panel" style="display:flex;flex-direction:column;gap:26px">
      ${['Il suo nome, cantato', 'Le sue passioni dentro il testo', 'Le parole che vuoi dirgli', 'Un file da tenere per sempre'].map(t => `<div class="row"><div class="chk">${CHECK}</div><div class="li">${t}</div></div>`).join('')}
    </div>
    <div class="spacer"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:24px">${'<span class="pill">Fai il quiz gratis →</span>'}${SEAL(170)}</div>`),
  // Caso migliore / caso peggiore
  'caso-peggiore': s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Caso migliore, caso peggiore: <em>non&nbsp;rischi&nbsp;niente</em></h1>
    <div class="spacer"></div>
    <div class="panel" style="border:3px solid #2E7D4F"><div class="kick" style="color:#2E7D4F">CASO MIGLIORE</div><div class="serif" style="font-size:50px;font-weight:600;line-height:1.15;margin-top:12px">Ascolta la sua canzone e si emoziona.</div></div>
    <div style="height:28px"></div>
    <div class="panel"><div class="kick">CASO PEGGIORE</div><div class="serif" style="font-size:50px;font-weight:600;line-height:1.15;margin-top:12px">Ci scrivi «rivoglio i soldi» e ti rimborsiamo, più 5 €.</div></div>
    <div class="spacer"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:24px"><span class="pill">Crea la sua canzone →</span>${SEAL(170)}</div>`),
  // Occasione: i più piccoli
  'ninna-nanna': s => page(s, `${BRAND(true)}
    <svg viewBox="0 0 200 200" width="${s ? 230 : 190}" height="${s ? 230 : 190}" style="position:absolute;right:90px;top:${s ? 300 : 120}px"><circle cx="100" cy="100" r="70" fill="#FFD9A0"/><circle cx="135" cy="80" r="66" fill="#4B2F63"/><circle cx="30" cy="40" r="4" fill="#FFD9A0"/><circle cx="170" cy="170" r="5" fill="#FFD9A0"/><circle cx="20" cy="160" r="3" fill="#FFD9A0"/></svg>
    <div class="gap" style="height:${s ? 240 : 170}px"></div>
    <h1>La ninna nanna della buonanotte, <em>con il&nbsp;suo&nbsp;nome</em></h1><div class="gap" style="height:28px"></div>
    <p class="sub">Per i più piccoli, o per il bimbo che stai aspettando: una ninna nanna scritta solo per lui.</p>
    <div class="spacer"></div>
    <div class="panel lyric">♪ Chiudi gli occhi, <em>Aurora</em>,<br>la luna ti racconta una storia ♪</div>
    <div class="gap"></div><span class="pill">Crea la sua ninna nanna →</span>`, true, 'background:radial-gradient(700px 500px at 80% 15%,rgba(255,217,160,.18),transparent 60%),linear-gradient(170deg,#2B1F45,#4B2F63 60%,#5E4380)'),
  // Più figli: il pacchetto da 3
  fratelli: s => page(s, `${BRAND()}<div class="gap"></div>
    <h1>Una canzone per <em>ognuno dei tuoi figli</em></h1><div class="gap" style="height:24px"></div>
    <p class="sub">Ognuno con la sua, con il suo nome. Nessuno si sente secondo.</p>
    <div class="spacer"></div>
    <div style="display:flex;flex-direction:column;gap:22px">
      ${['Sofia', 'Leonardo', 'Giulia'].map((n, i) => `<div style="background:linear-gradient(150deg,#4B2F63,#6B4A87);border-radius:30px;padding:26px 34px;color:#fff;display:flex;align-items:center;gap:26px;margin-left:${i * 40}px"><div style="flex:none;width:76px;height:76px;border-radius:50%;background:repeating-radial-gradient(circle,#1d1426 0 3px,#2a1f36 3px 6px);display:grid;place-items:center"><div style="width:26px;height:26px;border-radius:50%;background:#D2553F;border:4px solid #FFD9A0"></div></div><div class="serif" style="font-size:44px;font-weight:600">La canzone di <em style="color:#FFD9A0;font-weight:500">${n}</em></div></div>`).join('')}
    </div>
    <div class="spacer"></div>
    <div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap"><span class="pill">3 canzoni a 49 €</span><span style="font-size:34px;color:#4A3F5C">16,33 € a canzone</span></div>`),
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
