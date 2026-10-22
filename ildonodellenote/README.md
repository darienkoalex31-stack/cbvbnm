# Il Dono delle Note — landing page + quiz

Sito per **ildonodellenote.it**: landing page per il traffico delle Facebook/Instagram Ads, rivolta alle mamme che vogliono regalare al figlio una canzone personalizzata. Il percorso è **landing → quiz → raccolta contatto → proposta con prezzi → pagamento**.

È un sito statico (HTML + CSS + JS, senza dipendenze e senza build): si pubblica così com'è.

| File | Cosa contiene |
|---|---|
| `index.html` | Landing, quiz, form contatto e pagina offerta (tutto in un'unica pagina, veloce da caricare su mobile) |
| `config.js` | **L'unico file da compilare**: Meta Pixel, webhook dei lead, link di pagamento, video/audio dell'hero |
| `grazie.html` | Pagina di conferma dopo il pagamento (evento `Purchase` del pixel) |
| `privacy.html` | Informativa privacy e cookie (**da completare** con i dati del titolare) |
| `og-image.png` | Anteprima mostrata quando il link viene condiviso (WhatsApp, Facebook) |

---

## 1. La strategia della landing

Il traffico da Facebook è al 90% da telefono, freddo e distratto: la pagina deve far capire in 3 secondi **cosa ricevi, per chi è e perché non rischi niente**, e portare al quiz con un solo tocco.

**Sopra la piega (hero)**, nell'ordine:
1. **Titolo = offerta + risultato**: *"Regala a tuo figlio una canzone tutta sua, con il suo nome e la vostra storia"*.
2. **Sottotitolo**: come funziona in una riga (*tu racconti, noi scriviamo e produciamo*).
3. **Garanzia Emozione**: *se non ti emoziona la riscriviamo gratis, altrimenti rimborso*. Toglie il rischio, che è la prima obiezione su un acquisto emotivo e “al buio”.
4. **Media** (vedi sotto).
5. **Bottone**: *"Crea la sua canzone →"* con *"Completa il quiz in 2 minuti · Gratis e senza impegno"*. Su mobile c'è anche una barra col bottone sempre visibile in basso.

Sotto: come funziona (3 passi), cosa c'è dentro la canzone, frase emotiva (*"Tra vent'anni non si ricorderà dei giocattoli…"*), occasioni d'uso, garanzia, FAQ, CTA finale.

### Immagine o video?
**Video, appena lo hai.** Per questo prodotto l'asset che vende è la **reazione**: un bambino che sente il suo nome cantato, la mamma che si commuove. Specifiche consigliate: verticale 4:5 o 9:16, 15–30 secondi, sottotitoli impressi (molti guardano senza audio), il nome cantato entro i primi 3 secondi. Lo stesso video può essere anche la creatività dell'annuncio, così la landing continua quello che la mamma ha appena visto.

**Finché non c'è il video**, l'hero mostra una “card” animata della canzone (vinile che gira, titolo *"La canzone di Sofia"* con nomi che cambiano: Sofia, Leonardo, Giulia…, e una strofa di testo). Fa vedere subito che il prodotto è *personalizzato*. Appena hai **un MP3 di esempio** mettilo in `sampleAudio`: compare il tasto ▶ nella card. Far sentire la qualità è la cosa più importante dopo il video.

### Copy da testare (A/B)
- Titolo B: *"Il regalo di Natale che tuo figlio non dimenticherà: una canzone scritta solo per lui"* (da usare fino a metà dicembre).
- Titolo C: *"Il suo nome, la vostra storia, le tue parole. In una canzone."*
- CTA B: *"Scopri come sarà la sua canzone →"*

---

## 2. Il quiz

Una domanda per schermata, risposte grandi da toccare col pollice, avanzamento automatico sulle scelte singole, barra di avanzamento, tasto indietro (funziona anche il “indietro” del telefono). Le risposte vengono salvate nel browser: se la mamma chiude e riapre, le ritrova.

Le domande servono **sia a scrivere la canzone sia a vendere**: ogni risposta è un piccolo “sì” che aumenta l'investimento emotivo prima di vedere il prezzo. Il nome del figlio viene usato nelle domande successive (*"Quanti anni ha Leonardo?"*).

| # | Domanda | Perché |
|---|---|---|
| 1 | Per chi è? *Mio figlio / Mia figlia / I miei figli / Il bimbo che aspetto* | Adatta tutti i testi (lui/lei/loro). “Il bimbo che aspetto” apre il mercato delle future mamme |
| 2 | Come si chiama? + soprannome | Il nome è il cuore del prodotto; il soprannome rende il testo intimo |
| 3 | Età (0–2 … 18+) | Tono e stile; salta per chi è in attesa |
| 4 | Occasione (Natale, compleanno, nascita/battesimo, comunione, 18 anni/laurea, nessuna) | Tono del testo + segmentazione del pubblico |
| 5 | Da parte di chi (mamma, mamma e papà, famiglia, nonni) | Il testo parla con “io” o “noi”. I nonni sono un secondo pubblico da targetizzare |
| 6 | Stile musicale (ninna nanna, pop, ballata, acustica, rap, rock) | Con badge **Consigliato** in base all'età |
| 7 | Voce (femminile, maschile, duetto, scegliete voi) | |
| 8 | Cosa lo rende speciale (max 3) | Materiale per le strofe; tutte parole valide per maschi e femmine |
| 9 | Cosa ama (max 4 + “altro”) | Dettagli concreti nel testo |
| 10 | Cosa vuoi che senta (max 2) | Il messaggio del ritornello |
| 11 | Un ricordo o una frase (facoltativo) | Ciò che rende la canzone unica |

Poi: **schermata “Stiamo immaginando la canzone di Leonardo…”** (4 secondi, aumenta il valore percepito) → **form contatto** (nome, email, WhatsApp facoltativo, consenso privacy) → **pagina offerta personalizzata**: riepilogo con *titolo provvisorio* generato dalle risposte (es. *« Sempre accanto a te, Leonardo »*), 3 pacchetti, garanzia, cosa succede dopo l'ordine.

### Prezzi proposti (modificabili in `index.html`, cerca `var PKGS`)
| Pacchetto | Prezzo | Contenuto |
|---|---|---|
| La Canzone | €49 | Canzone 2–3 min, MP3, 5 giorni, 1 modifica |
| **Canzone + Video Ricordo** (preselezionato, “il più scelto”) | €69 | + video con testo e foto, 3 giorni, 2 modifiche |
| Il Regalo Completo | €99 | + seconda versione (ninna nanna/karaoke), biglietto con QR, 48 ore, modifiche illimitate |

Il pacchetto centrale è quello su cui puntare: il primo fa da “ancora” bassa, il terzo fa sembrare il centrale un affare.

---

## 3. Configurazione (`config.js`)

1. **Meta Pixel** → `pixelId`. Si attiva **solo se l'utente accetta i cookie** (obbligatorio in Italia). Eventi inviati: `PageView`, `ViewContent`, `QuizStart` e `QuizComplete` (custom), `Lead` (form compilato), `InitiateCheckout` (clic su ordina), `Purchase` (su `grazie.html`). Per le campagne ottimizza su `Lead` all'inizio, poi su `Purchase` quando hai almeno ~50 acquisti a settimana. Consigliato aggiungere più avanti la Conversions API (lato server) per recuperare le conversioni perse.
2. **Lead** → `webhookUrl`. Ogni lead arriva in JSON con contatti, risposte leggibili, sorgente UTM/fbclid e codice (`DDN-XXXXX`). Il modo più semplice: uno scenario **Make** o **Zapier** con “Custom webhook” → Google Sheets + email/WhatsApp di notifica a te. Senza webhook i lead **non vengono salvati da nessuna parte**: configuralo prima di accendere le ads.
3. **Pagamenti** → `paymentLinks`. Crea 3 **Payment Link su Stripe** (49/69/99 €), attiva Apple Pay, Google Pay (e PayPal se vuoi), e come pagina di conferma imposta `https://ildonodellenote.it/grazie.html`. Il sito passa a Stripe il codice lead (`client_reference_id`) e l'email precompilata, così colleghi ogni pagamento alle risposte del quiz. Finché i link sono vuoti, il bottone mostra “Richiesta ricevuta, ti scriviamo entro 24 ore” (utile per partire subito e chiudere le vendite su WhatsApp).
4. **Media** → `heroVideo` (+ `heroVideoPoster`) e/o `sampleAudio`: carica i file nella cartella e scrivi il nome, es. `'esempio-sofia.mp3'`.
5. **Email** → `contactEmail`.

## 4. Pubblicazione su ildonodellenote.it

Il modo più rapido: **Netlify** (gratis). *Add new site → Deploy manually* e trascina la cartella `ildonodellenote/` (oppure collega questo repository con *Base directory* = `ildonodellenote`). Poi *Domain settings → Add custom domain → ildonodellenote.it* e imposta nel pannello del registrar i DNS che Netlify ti indica. L'HTTPS è automatico. Va bene uguale anche Vercel o Cloudflare Pages.

Per provarlo in locale: `cd ildonodellenote && python3 -m http.server` e apri `http://localhost:8000`.

## 5. Da verificare prima di accendere le ads

- [ ] **Tempi di consegna** (5 giorni / 3 giorni / 48 ore) e **scadenza di Natale** (15 dicembre, nella barra in alto e nelle FAQ): devono essere tempi che riesci davvero a rispettare.
- [ ] **Condizioni della Garanzia Emozione** (riscrittura gratuita + rimborso): scrivile anche nei termini di vendita.
- [ ] **Privacy**: completa `privacy.html` (titolare, P.IVA, fornitori) e falla verificare. Servono anche i **termini e condizioni di vendita** (diritto di recesso: per un prodotto personalizzato è escluso, ma va scritto).
- [ ] **Recensioni**: la pagina non contiene testimonianze perché il business è nuovo. Appena hai le prime reazioni vere (video/messaggi WhatsApp con il permesso delle clienti), aggiungi una sezione recensioni: è la leva di conversione più forte dopo il video. Non usare recensioni inventate.
- [ ] Verifica il dominio in **Meta Business → Sicurezza del brand → Domini**.
