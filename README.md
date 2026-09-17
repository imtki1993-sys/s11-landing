# S11 – Landing page (COD Maroc)

Page de vente S11 Support + Wireless 15W avec formulaire de commande relié à Google Sheets et au Facebook Pixel.

## Fichiers
- `index.html` – la page
- `config.js` – **les réglages à modifier** : prix, numéro WhatsApp, Pixel ID, lien Google Sheet, frais de livraison
- `google-apps-script/Code.gs` – script à coller dans Google Sheets (Extensions → Apps Script)
- `vercel.json` – configuration Vercel

## Modifier un réglage
1. Ouvre `config.js` sur GitHub → icône crayon ✏️
2. Change la valeur → **Commit changes**
3. Vercel met le site à jour automatiquement (1–2 minutes)

## Google Sheet
1. Google Sheet → Extensions → Apps Script → colle `Code.gs` → Enregistrer
2. Déployer → Nouveau déploiement → Application Web → Accès : **Tout le monde**
3. Copie le lien `/exec` dans `sheetUrl` de `config.js`
