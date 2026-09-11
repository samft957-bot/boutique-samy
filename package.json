// server.js
// Serveur minimal pour créer des sessions de paiement Stripe Checkout.
// Le panier (liste d'articles) est envoyé par le front-end en JSON,
// et ce serveur contacte Stripe avec la clé secrète (jamais exposée au navigateur).

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

// --- Config ---
const PORT = process.env.PORT || 3000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// URL de votre site (utilisée pour les redirections après paiement)
const SITE_URL = process.env.SITE_URL || "https://votre-site.example.com";

if (!STRIPE_SECRET_KEY) {
  console.error("ERREUR: la variable d'environnement STRIPE_SECRET_KEY n'est pas définie.");
  process.exit(1);
}

const stripe = Stripe(STRIPE_SECRET_KEY);

app.use(cors()); // autorise les requêtes depuis votre site (à restreindre si besoin, voir plus bas)
app.use(express.json());

// --- Route de test ---
app.get("/", (req, res) => {
  res.send("Backend Stripe opérationnel.");
});

// --- Création d'une session de paiement ---
// Le front-end doit envoyer un POST avec un body du type :
// {
//   "items": [
//     { "name": "T-shirt vintage", "price": 15.00, "quantity": 1 },
//     { "name": "Sac en cuir", "price": 40.00, "quantity": 2 }
//   ]
// }
// "price" est en euros (nombre décimal), converti en centimes pour Stripe.
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide ou invalide." });
    }

    const line_items = items.map((item) => {
      if (!item.name || typeof item.price !== "number" || item.price <= 0) {
        throw new Error(`Article invalide: ${JSON.stringify(item)}`);
      }
      return {
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // conversion en centimes
        },
        quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${SITE_URL}/success.html`,
      cancel_url: `${SITE_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur lors de la création de la session Stripe:", err.message);
    res.status(500).json({ error: "Impossible de créer la session de paiement." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
