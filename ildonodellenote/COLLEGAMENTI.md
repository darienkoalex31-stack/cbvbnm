# Collegamenti: Stripe, primo messaggio WhatsApp, misurazioni

Cosa serve per collegare il funnel ai servizi esterni. Nessuno di questi passaggi richiede di condividere password o chiavi segrete: si usano i pannelli ufficiali (Stripe, Meta, Make) e nel sito si incollano solo link e ID pubblici in `config.js`.

---

## 1. Stripe

### Flusso scelto: pagamento diretto alla fine del funnel, con Payment Link

| Opzione | Va bene qui? |
|---|---|
| **Pagamento diretto nel funnel** | **Sì.** Prezzo basso (25–54 €), acquisto d'impulso: la mamma paga subito dopo aver visto il riepilogo. |
| Acconto o deposito | No: su 25 € un acconto complica senza ridurre il rischio. |
| Pagamento dopo la qualificazione | No: aggiunge un contatto in più e fa perdere vendite. La qualificazione la fa già il quiz. |
| Link di pagamento mandato al cliente | Sì, **come recupero**: lo stesso Payment Link si manda su WhatsApp a chi ha lasciato il numero ma non ha pagato. |

Il sito è statico, quindi **bastano i Payment Link**: niente server, niente chiavi API.

### Cosa mi serve da te

Solo **gli indirizzi dei Payment Link** (iniziano con `https://buy.stripe.com/...`). Sono pubblici, si possono incollare in chat o direttamente in `config.js`.

| Chiave in `config.js` | Pacchetto | Prezzo | Pagina di conferma da impostare su Stripe |
|---|---|---|---|
| `uno` | 1 canzone | 25 € | `https://ildonodellenote.it/grazie.html` |
| `due` | 2 canzoni | 35 € | `https://ildonodellenote.it/grazie.html?canzoni=2` |
| `tre` | 3 canzoni | 49 € | `https://ildonodellenote.it/grazie.html?canzoni=3` |
| `uno_express` | 1 canzone + 48 ore | 30 € | `https://ildonodellenote.it/grazie.html` |
| `due_express` | 2 canzoni + 48 ore | 40 € | `https://ildonodellenote.it/grazie.html?canzoni=2` |
| `tre_express` | 3 canzoni + 48 ore | 54 € | `https://ildonodellenote.it/grazie.html?canzoni=3` |

Con un solo link (`uno`) il sito funziona già: per le altre scelte mostra "ti scriviamo su WhatsApp" e la vendita si chiude in chat.

### Come crearli (Dashboard Stripe)
1. **Catalogo prodotti** → crea i prodotti con i prezzi della tabella.
2. **Payment Link** → *Nuovo* → scegli il prodotto.
3. Scheda **Dopo il pagamento** → *Non mostrare la pagina di conferma* → *Reindirizza al tuo sito* → l'indirizzo della tabella.
4. **Impostazioni → Metodi di pagamento**: carte, Apple Pay, Google Pay (PayPal e Klarna se vuoi).
5. Copia il link e incollalo in `config.js`.

Il sito aggiunge da solo al link il **codice ordine** (`client_reference_id`, es. `DDN-K3F9A2B`) e l'email, se la mamma l'ha scritta. Così ogni pagamento si collega alle risposte del quiz.

### Conferma del pagamento
`grazie.html` serve alla cliente, ma **non è una prova di pagamento** (chiunque può aprirla). La conferma vera è l'evento Stripe `checkout.session.completed`, che contiene il `client_reference_id`. In Make si legge con il modulo **Stripe › Watch events**, collegato con il login di Stripe (non servono chiavi in chat): vedi lo scenario B qui sotto.

---

## 2. Primo messaggio WhatsApp automatico

### Le regole del messaggio

| Cosa | Scelta |
|---|---|
| **Evento che lo fa partire** | Invio del modulo contatti alla fine del quiz (campo `evento` = `contatto` del webhook). |
| **Numero mittente** | Il numero WhatsApp del negozio, registrato sulla **WhatsApp Business Platform** (Cloud API di Meta). |
| **Destinatario** | Il numero scritto nel modulo, obbligatorio. Il sito lo manda già in formato internazionale (`+393331234567`) nel campo `whatsapp`. |
| **Consenso** | Casella obbligatoria nel modulo: *"acconsento a ricevere su WhatsApp (ed email, se indicata) il riepilogo e gli aggiornamenti sul mio ordine. Posso smettere quando voglio rispondendo STOP."* Il webhook la invia nel campo `consenso_whatsapp` (`sì`) insieme alla `data`: salvateli nel foglio. |
| **Stop ai messaggi** | Ogni messaggio finisce con "Rispondi STOP…". Chi risponde STOP viene segnato nel foglio e non riceve più messaggi (scenario C). |
| **Piattaforma** | Make + modulo ufficiale **WhatsApp Business Cloud**, oppure un fornitore con interfaccia pronta (vedi sotto). |

### Perché serve la WhatsApp Business Platform
L'app **WhatsApp Business** del telefono non può mandare messaggi automatici a chi non ti ha scritto prima. Per un primo messaggio automatico serve la **Cloud API di Meta**, con un **modello di messaggio approvato da Meta**. Da evitare gli strumenti non ufficiali che automatizzano l'app: Meta blocca il numero.

Due strade:
- **A. Make + Cloud API di Meta.** La spendi meno e controlli tutto, ma la configurazione è più tecnica.
- **B. Un fornitore ufficiale (BSP)** con interfaccia già pronta per modelli, rubrica e risposte STOP. Si paga un canone mensile, ma è più semplice.

**Cosa serve in entrambi i casi:** un account Meta Business (Business Manager), un account WhatsApp Business collegato, un numero per l'API e un metodo di pagamento su Meta (i messaggi con modello si pagano a messaggio). Al numero si collega anche l'app WhatsApp Business: Meta permette in molti casi di usare lo stesso numero sull'app e sull'API, ma va verificato in fase di attivazione. Finché Meta non verifica l'azienda, ci sono limiti bassi sul numero di persone a cui scrivere ogni giorno.

### Il modello da far approvare a Meta
- Nome: `riepilogo_quiz`
- Lingua: italiano
- Categoria: **Utilità**, perché risponde a una richiesta della cliente. Meta può riclassificarlo come Marketing.

```
Ciao {{1}}, sono Il Dono delle Note 🎶
Abbiamo ricevuto le tue risposte per la canzone di {{2}}.

Se hai già completato l'ordine, entro 24 ore ti mandiamo qui il testo da approvare.
Se non l'hai ancora fatto, puoi completarlo da qui: {{3}}

Per qualsiasi domanda rispondi pure a questo messaggio.
Rispondi STOP per non ricevere altri messaggi.
```

| Variabile | Dove la prendi nel webhook |
|---|---|
| `{{1}}` | `nome` (es. Giulia) |
| `{{2}}` | `nome_bambino`, oppure "tuo figlio" se è vuoto |
| `{{3}}` | il Payment Link da 25 € + `?client_reference_id=` + `codice` |

Il link nel messaggio porta direttamente a Stripe e non al sito. Chi arriva dagli annunci fa il quiz nel browser interno di Facebook o Instagram, mentre il link di WhatsApp si apre in un altro browser: lì le risposte salvate non ci sono. Il link Stripe con il codice ordine funziona ovunque.

Un secondo modello, `ordine_ricevuto` (Utilità), per lo scenario B: *"Grazie {{1}}! Abbiamo ricevuto il tuo ordine {{2}}. Entro 24 ore, di solito in giornata, ti mandiamo qui il testo da approvare. Rispondi STOP per non ricevere altri messaggi."*

### Scenari Make
Il sito invia i dati come modulo, con campi separati e nomi in italiano: `data`, `evento`, `codice`, `nome`, `whatsapp`, `email`, `consenso_whatsapp`, `marketing`, `per_chi`, `nome_bambino`, `soprannome`, `eta`, `occasione`, `da_parte_di`, `stile`, `voce`, `caratteristiche`, `passioni`, `messaggi`, `ricordo`, `fonte`, `campagna`, `annuncio`, `fbclid`, `pagina` (contatto); `pacchetto`, `canzoni`, `consegna_48h`, `importo` (ordine); `canzone_n`, `di` (canzone extra); `link_whatsapp` e `messaggio_whatsapp` (contatto e ordine: il messaggio già personalizzato e il link `wa.me` che apre la chat con il testo compilato, da inviare a mano dall'app WhatsApp Business). Ogni invio contiene sempre tutti i campi (vuoti quando non servono a quell'evento): basta un solo esempio per farli conoscere tutti a Make.

**A. Contatto dal quiz → foglio + primo messaggio**
1. **Webhooks › Custom webhook**: copia l'indirizzo in `config.js` → `webhookUrl`.
2. **Router** sul campo `evento`: `contatto`, `ordine`, `canzone_extra`.
3. `contatto` → **Google Sheets › Add a row** nella scheda *Contatti*; `ordine` → scheda *Ordini*.
4. `contatto` → **WhatsApp Business Cloud › Send a Template Message**: destinatario `whatsapp`, modello `riepilogo_quiz`, variabili come sopra. Filtro: invia solo se `consenso_whatsapp` è `sì`.
5. `canzone_extra` → **Google Sheets › Add a row** nella scheda *Canzoni extra*, con lo stesso codice ordine.

**B. Pagamento Stripe → foglio + conferma**
1. **Stripe › Watch events**: evento `checkout.session.completed`.
2. **Google Sheets › Search rows**: codice = `client_reference_id`.
3. **Google Sheets › Update a row**: `pagato = sì`, importo, data.
4. **WhatsApp Business Cloud › Send a Template Message**: modello `ordine_ricevuto`.

**C. Risposte STOP**
1. **WhatsApp Business Cloud › Watch events**: messaggi in arrivo.
2. Filtro: testo uguale a STOP (maiuscole o minuscole).
3. **Google Sheets › Update a row**: `whatsapp_stop = sì`. Negli scenari A e B aggiungi il filtro "solo se `whatsapp_stop` è vuoto".
4. Risposta: "Va bene, non ti scriveremo più qui."

---

## 3. Misurazioni

Inserisci in `config.js` l'ID del **Meta Pixel** (`pixelId`) e di **Google Analytics 4** (`ga4Id`). Si attivano solo per chi accetta i cookie.

| Momento | Meta Pixel | Google Analytics 4 |
|---|---|---|
| Apertura della landing | `PageView`, `ViewContent` | `page_view`, `view_landing` |
| Clic su "Crea la sua canzone" | `QuizStart` | `quiz_start` |
| Ogni domanda mostrata | — | `quiz_step` (`step_id`, `step_number`) |
| Fine del quiz | `QuizComplete` | `quiz_complete` |
| Modulo contatti inviato | `Lead` | `generate_lead` |
| Clic su "Ordina" | `InitiateCheckout` (con importo) | `begin_checkout` (con importo) |
| Pagina di conferma | `Purchase` (con importo) | `purchase` (con importo e codice) |

**I numeri da guardare ogni settimana:**
- **Tasso di avvio del quiz** = `quiz_start` ÷ `view_landing`
- **Tasso di completamento** = `quiz_complete` ÷ `quiz_start`
- **Tasso di contatto** = `generate_lead` ÷ `quiz_complete`
- **Conversione finale** = acquisti ÷ visite della landing (e acquisti ÷ contatti)

**Dove si fermano le persone:** in GA4 vai su *Esplora → Esplorazione della canalizzazione* e crea un passaggio per ogni `step_number` da 1 a 10 dell'evento `quiz_step`. Per vedere `step_id` nei rapporti, registralo come dimensione personalizzata (ambito: evento) in *Amministrazione → Definizioni personalizzate*.

**Quali numeri sono completi:** Pixel e GA4 vedono solo chi accetta i cookie. Il conteggio completo dei contatti è nel foglio Google (webhook), quello dei pagamenti è in Stripe.

---

## 4. Prova completa da telefono (prima di accendere gli annunci)
1. Apri il sito dal telefono **dentro Instagram o Facebook** (mandati il link in DM e aprilo da lì).
2. Accetta i cookie e, in Gestione Eventi di Meta, apri *Test eventi*: devono comparire gli eventi della tabella.
3. Fai il quiz fino in fondo e lascia il tuo numero: deve arrivare la riga nel foglio e il messaggio `riepilogo_quiz` su WhatsApp.
4. Paga con un Payment Link in **modalità test** di Stripe (carta `4242 4242 4242 4242`): devi tornare su `grazie.html`, la riga nel foglio deve diventare "pagato" e deve arrivare `ordine_ricevuto`.
5. Ripeti con "2 canzoni": in `grazie.html` deve comparire "Racconta la canzone 2", e il quiz della seconda canzone deve arrivare nel foglio con lo stesso codice.
6. Rispondi STOP al messaggio: la riga deve risultare `whatsapp_stop = sì`.

---

## 5. Risposte rapide WhatsApp Business

Si salvano nell'app (*Impostazioni → Strumenti per l'azienda → Risposte rapide → +*) e in chat si richiamano scrivendo `/` e la scorciatoia. Sono scritte senza nomi da sostituire, così si inviano senza modifiche. Il primo messaggio (contatto o ordine) è già pronto nel foglio Google, colonna *Scrivi su WhatsApp*.

| Scorciatoia | Quando |
|---|---|
| `/testo` | Dopo il pagamento, entro 24 ore: prima incolla il testo della canzone in un messaggio, poi invia questa. |
| `/promemoria` | Se dopo 24 ore non ha risposto sul testo. |
| `/modifiche` | Quando chiede di cambiare qualcosa nel testo. |
| `/approvato` | Quando risponde OK al testo. |
| `/consegna` | Alla consegna: invia questa e subito dopo il file MP3. |
| `/reazione` | Qualche giorno dopo l'occasione del regalo. |
| `/ricontatto` | Una volta sola, 1–2 giorni dopo il primo messaggio, a chi non ha ordinato e non ha risposto. |
| `/stop` | Quando scrive STOP: poi scrivi *STOP* nella colonna *Stato* del foglio e non riscriverle più. |

Manca `/pagamento`: si scrive quando è deciso come si paga (finché Stripe non è collegato, la FAQ *Come pago?* del sito va aggiornata).

**/testo**
```
Qui sopra trovi il testo della tua canzone 🎵
Leggilo con calma, magari ad alta voce 💛

• Se ti piace così, rispondi OK e passiamo alla musica.
• Se vuoi cambiare qualcosa (una parola, un soprannome, un ricordo da aggiungere), scrivimi cosa e lo sistemo.

Dimmi anche che voce preferisci: femminile, maschile o un duetto. Se non hai preferenze, scegliamo noi quella più adatta.
```

**/promemoria**
```
Ciao! 😊 Hai avuto modo di leggere il testo della canzone?
Appena mi dai l'OK passiamo alla musica: i tempi di consegna partono da lì. Se vuoi cambiare qualcosa, scrivimi pure.
```

**/modifiche**
```
Grazie, perfetto! ✍️ Sistemo il testo e te lo rimando qui entro 24 ore.
Ti ricordo che i tempi di consegna partono dall'approvazione del testo finale: ogni modifica sposta un po' la data di consegna.
```

**/approvato**
```
Testo approvato ✅ Grazie!
Ora passiamo alla musica 🎶 La canzone arriva qui su WhatsApp entro circa 7 giorni, oppure entro 48 ore se hai scelto la consegna prioritaria.
```

**/consegna**
```
Eccola! 🎁 La tua canzone è pronta: trovi qui sotto il file MP3.

Un consiglio per il momento del regalo: fagliela ascoltare a sorpresa e tieni il telefono pronto per riprendere la reazione 💛

Se non ti emoziona come speravi, dimmelo: con la Garanzia Emozione la riscriviamo gratis, oppure ti rimborsiamo.
```

**/reazione**
```
Ciao! 😊 Com'è andato il momento della canzone?
Ci farebbe tantissimo piacere saperlo. E se hai ripreso la reazione, mandacela pure: per noi è il regalo più bello 💛
Non pubblichiamo mai niente senza il tuo permesso scritto.
```

**/ricontatto**
```
Ciao! 😊 Ti scrivo solo per sapere se ti va ancora di regalare la canzone.
Se hai dubbi su prezzo, tempi o come funziona, chiedimi pure: ti rispondo volentieri.
```

**/stop**
```
Ricevuto, non riceverai altri messaggi da noi 🙏
Se un giorno vorrai regalare una canzone, ci trovi qui 💛
```
