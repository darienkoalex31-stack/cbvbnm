# Progetto in pausa (dal 16/11/2026)

## Cosa è stato spento
- **Stripe:** i 6 link di pagamento sono disattivati. Chi li apre vede «Il Dono delle Note è in pausa». Il pagamento di prova da 30 € era già rimborsato.
- **Sito:** la pagina principale (`index.html`) è stata sostituita da una pagina «in pausa», senza quiz, senza pagamenti e senza tracciamento. Va pubblicata su Netlify oppure il progetto Netlify va eliminato: vedi sotto.

## Da fare nei pannelli (non posso farlo io)
- **Netlify:** eliminare il progetto `ildonodellenote`. Il piano è gratuito, ma eliminarlo toglie il sito da internet.
- **Meta:** spegnere le campagne e togliere la carta dal conto pubblicitario.
- **Make:** spegnere lo scenario.
- **Suno:** annullare l'abbonamento Pro (se non serve per il nuovo progetto).
- **IONOS:** disattivare il rinnovo automatico del dominio `ildonodellenote.it` e dell'email `ciao@`.

## Per ripartire
1. Riportare il sito com'era: `git revert` del commit «Metti il sito in pausa».
2. Riattivare i 6 link di pagamento su Stripe.
3. Riaccendere lo scenario di Make e le campagne su Meta.
4. Tutto il resto (appunti dei libri, studio sui conti, annunci) è in questa cartella.
