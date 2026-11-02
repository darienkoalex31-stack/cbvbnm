/*
 * Il Dono delle Note — configurazione del sito.
 * Questo è l'UNICO file da modificare per collegare pixel, raccolta lead e pagamenti.
 * Lascia una voce vuota ('') per disattivarla.
 */
window.DDN_CONFIG = {
  // ID del Meta Pixel (Gestione Eventi di Facebook). Es. '123456789012345'
  pixelId: '4438778956385371',

  // ID di misurazione Google Analytics 4. Es. 'G-XXXXXXXXXX'
  // Serve a misurare avvio quiz, abbandoni domanda per domanda, contatti e acquisti.
  ga4Id: 'G-XVWQRNRRH7',

  // Webhook (Make) che riceve i dati del quiz come campi separati. Il campo "evento" vale:
  // "contatto" (modulo compilato), "ordine" (clic su Ordina) o "canzone_extra"
  // (risposte per la seconda o terza canzone).
  webhookUrl: 'https://hook.eu1.make.com/d3e7xpi86k4qonvv4srl9buqjer1ihjn',

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
    uno: 'https://buy.stripe.com/fZueVf2yPf703KQ9jYaVa00',            // 1 canzone, 25 €
    due: 'https://buy.stripe.com/00w7sNc9pe2W1CIfImaVa01',            // 2 canzoni, 35 €
    tre: 'https://buy.stripe.com/eVq28tgpF0c6ftyao2aVa02',            // 3 canzoni, 49 €
    uno_express: 'https://buy.stripe.com/7sY3cx0qH9MGchm1RwaVa03',    // 1 canzone + 48 ore, 30 €
    due_express: 'https://buy.stripe.com/4gM00l7T9cYSa9edAeaVa04',    // 2 canzoni + 48 ore, 40 €
    tre_express: 'https://buy.stripe.com/bJe5kF7T9aQK0yEbs6aVa05'     // 3 canzoni + 48 ore, 54 €
  },

  // Payment Link di PROVA (Stripe in modalità test, nessun addebito vero): il sito li usa solo se
  // l'indirizzo contiene ?prova=1, es. https://ildonodellenote.it/?prova=1 — le visitatrici normali
  // non li vedono. Carta di prova: 4242 4242 4242 4242, scadenza futura, CVC qualsiasi.
  paymentLinksTest: {
    uno: 'https://buy.stripe.com/test_fZubJ00FefKb8mId5GbMQ00',
    due: 'https://buy.stripe.com/test_cNi8wOfA8gOf7iE6HibMQ01',
    tre: 'https://buy.stripe.com/test_7sYcN487G55x9qM1mYbMQ02',
    uno_express: 'https://buy.stripe.com/test_5kQ00i5Zy55x9qM3v6bMQ03',
    due_express: 'https://buy.stripe.com/test_eVq7sKafO41tauQ3v6bMQ04',
    tre_express: 'https://buy.stripe.com/test_3cI3cu1Ji8hJ8mIaXybMQ05'
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
