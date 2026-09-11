# Mettre en place le vrai paiement Stripe

## 1. Compte Stripe
Créez un compte sur https://dashboard.stripe.com si ce n'est pas déjà fait,
puis récupérez votre **clé secrète** (Développeurs → Clés API → "Secret key",
commence par `sk_live_...` ou `sk_test_...` pour tester).

## 2. Déployer le backend (server.js)
Ce petit serveur est indispensable : c'est lui qui contacte Stripe avec votre
clé secrète (qui ne doit jamais apparaître dans le site lui-même).

Le plus simple pour héberger ça gratuitement : **Render.com** ou **Railway.app**.
- Créez un nouveau projet, connectez-y ces 3 fichiers (server.js, package.json)
- Ajoutez une variable d'environnement `STRIPE_SECRET_KEY` avec votre clé secrète
- Déployez : vous obtenez une URL du type `https://boutique-backend.onrender.com`

## 3. Connecter le site à ce backend
Ouvrez `boutique-revente.html`, tout en haut du `<script>`, remplacez :
```js
const BACKEND_URL = "https://votre-backend.example.com";
```
par l'URL réelle obtenue à l'étape 2.

## 4. Tester
En mode test (clé `sk_test_...`), utilisez la carte de test Stripe :
`4242 4242 4242 4242`, n'importe quelle date future, n'importe quel CVC.

## À savoir
- Le prix envoyé au serveur vient du panier du navigateur. Pour une petite
  boutique perso c'est très bien ; si vous voulez empêcher toute
  manipulation du prix côté client, il faudrait aussi stocker vos articles
  côté serveur (base de données) plutôt que dans le navigateur — dites-le
  moi si vous voulez que je fasse cette évolution.
- Le lien de paiement Stripe par article (déjà présent dans le mode vendeur)
  continue de fonctionner en parallèle si vous préférez cette méthode plus
  simple pour certains articles.
