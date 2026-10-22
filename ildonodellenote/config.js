/*
 * Il Dono delle Note — configurazione del sito.
 * Questo è l'UNICO file da modificare per collegare pixel, raccolta lead e pagamenti.
 * Lascia una voce vuota ('') per disattivarla.
 */
window.DDN_CONFIG = {
  // ID del Meta Pixel (Gestione Eventi di Facebook). Es. '123456789012345'
  pixelId: '',

  // URL di un webhook che riceve i lead del quiz in JSON (Make, Zapier, n8n, Google Apps Script…).
  // Riceve due eventi: "lead" (dopo il form) e "checkout_click" (quando sceglie un pacchetto).
  webhookUrl: '',

  // Video nell'hero (MP4 verticale o quadrato, 15–30s). Se presente sostituisce la card animata.
  heroVideo: '',
  heroVideoPoster: '',

  // MP3 di esempio riprodotto dal pulsante ▶ della card nell'hero.
  sampleAudio: '',

  // Payment Link di Stripe (o altro checkout) per ciascun pacchetto.
  // Al link vengono aggiunti client_reference_id (codice lead) e prefilled_email.
  // Su Stripe imposta come pagina di conferma: https://ildonodellenote.it/grazie.html
  paymentLinks: {
    base: '',
    video: '',
    completo: ''
  },

  contactEmail: 'ciao@ildonodellenote.it'
};
