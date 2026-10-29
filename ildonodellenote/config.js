/*
 * Il Dono delle Note — configurazione del sito.
 * Questo è l'UNICO file da modificare per collegare pixel, raccolta lead e pagamenti.
 * Lascia una voce vuota ('') per disattivarla.
 */
window.DDN_CONFIG = {
  // ID del Meta Pixel (Gestione Eventi di Facebook). Es. '123456789012345'
  pixelId: '',

  // ID di misurazione Google Analytics 4. Es. 'G-XXXXXXXXXX'
  // Serve a misurare avvio quiz, abbandoni domanda per domanda, contatti e acquisti.
  ga4Id: '',

  // URL di un webhook che riceve i lead del quiz in JSON (Make, Zapier, n8n, Google Apps Script…).
  // Riceve tre eventi: "lead" (dopo il form), "checkout_click" (quando sceglie un pacchetto)
  // ed "extra_song" (risposte per la seconda o terza canzone).
  webhookUrl: 'https://hook.eu1.make.com/5mh7n47jyjjtnejlvpppxq8fs46vmel7',

  // Video nell'hero (MP4 verticale o quadrato, 15–30s). Se presente sostituisce la card animata.
  heroVideo: '',
  heroVideoPoster: '',

  // MP3 di esempio riprodotto dal pulsante ▶ della card nell'hero.
  sampleAudio: '',

  // Payment Link di Stripe (o altro checkout) per ciascun pacchetto.
  // Al link vengono aggiunti client_reference_id (codice lead) e prefilled_email.
  // Su Stripe imposta come pagina di conferma: https://ildonodellenote.it/grazie.html
  // Servono 6 link: i 3 pacchetti, con e senza consegna prioritaria in 48 ore (+5 €).
  // Se per ora hai un solo link, mettilo in "uno": per le scelte senza link il sito
  // mostra "Richiesta ricevuta, ti scriviamo su WhatsApp" e chiudi l'ordine in chat.
  paymentLinks: {
    uno: '',            // 1 canzone, 25 €
    due: '',            // 2 canzoni, 35 €
    tre: '',            // 3 canzoni, 49 €
    uno_express: '',    // 1 canzone + 48 ore, 30 €
    due_express: '',    // 2 canzoni + 48 ore, 40 €
    tre_express: ''     // 3 canzoni + 48 ore, 54 €
  },

  // Numero WhatsApp del negozio, solo cifre con prefisso (es. '393331234567').
  // Compare in fondo alla landing e nella pagina di conferma come "Scrivici su WhatsApp".
  whatsapp: '393780946643',

  // Dati dell'attività mostrati in fondo alla pagina (obbligatori per legge su un sito
  // che vende): ragione sociale o nome e cognome, e partita IVA.
  // Es. 'Il Dono delle Note di Mario Rossi · P.IVA 01234567890'
  legalInfo: '',

  contactEmail: 'ciao@ildonodellenote.it'
};
