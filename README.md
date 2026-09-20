# Projet Landing Pages COD (Maroc)

Page de vente + formulaire de commande + base de donnees + dashboard des commandes.

## Structure
| Fichier / dossier | Role |
|---|---|
| `index.html` | La landing page (formulaire, offres, tracking) |
| `config.js` | **Les reglages** : prix, WhatsApp, Pixels, API, page |
| `vercel.json` | Config Vercel |
| `.vercelignore` | Empeche Vercel de publier le dossier server |
| `server/api/` | API PHP : recoit commandes + visites |
| `server/admin/` | Dashboard des commandes (mot de passe) |
| `google-apps-script/` | Alternative Google Sheets (si pas d'hebergement PHP) |

## 1. Mettre la page en ligne (Vercel)
1. Envoyer les fichiers sur GitHub : `imtki1993-sys/s11-landing`
2. vercel.com > Add New > Project > importer le repo > Deploy
3. Settings > Domains : ajouter le nom de domaine

## 2. Base de donnees + dashboard (hebergement cPanel)
Voir `server/README.md`. Resume :
- cPanel > MySQL Databases : creer base + utilisateur
- Remplir `server/api/config.php`
- Envoyer `api/` et `admin/` dans `public_html/`
- Ouvrir une fois `/api/install.php` puis le supprimer
- Mettre `apiUrl` dans `config.js`

## 3. Tracking
- **Facebook** : ajouter les IDs dans `pixelIds` (config.js). Evenements : PageView, ViewContent, AddToCart, InitiateCheckout, Contact, Lead, Purchase + Scroll50/90, TimeOnPage30.
- **Google Analytics** : balise G-LQJRXFY95K dans le `<head>` de index.html. Evenements : view_item, add_to_cart, begin_checkout, generate_lead, purchase.
- **Vercel Analytics** : activer dans le dashboard Vercel (onglet Analytics).

## 4. Ajouter une nouvelle landing page
1. Copier `index.html` + `config.js` dans un nouveau dossier, ex `/montre-x/`
2. Changer dans `config.js` : `product`, `offers`, `pageSlug`, `pixelIds`
3. Remplacer les images dans `index.html`
4. Commit : Vercel publie `tondomaine.com/montre-x`
Toutes les commandes arrivent dans la meme base et le meme dashboard, separees par `pageSlug`.

## Checklist avant de lancer les pubs
- [ ] Numero WhatsApp reel dans `config.js`
- [ ] `apiUrl` rempli et commande test recue dans /admin/
- [ ] Pixel(s) Facebook verifies avec Meta Pixel Helper
- [ ] Google Analytics : visite visible dans Temps reel
- [ ] Prix et frais de livraison corrects
