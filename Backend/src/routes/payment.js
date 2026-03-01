const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");
require("dotenv").config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart } = req.body;

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:4000/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        products: JSON.stringify(cart),
        orderedAt: new Date().toISOString(),
      },
    });

    console.log("Stripe session created ✔");
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

// Backend success route triggered by Stripe redirect
router.get("/payment-success", async (req, res) => {
  console.log("Stripe success callback hit backend ✔");

  try {
    const sessionId = req.query.session_id || req.query.sessionId || req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Order save triggered ✔");

    if (session.payment_status === "paid") {
      const cart = JSON.parse(session.metadata.products || "[]");

      const order = new Order({
        products: cart.map((p) => ({
          id: p.id,
          name: p.name,
          size: p.size || "N/A",
          price: p.price,
          quantity: p.quantity,
          subtotal: p.price * p.quantity,
        })),
        totalAmount: session.amount_total / 100,
        paymentTime: new Date(session.created * 1000),
        createdAt: new Date(),
      });

      await order.save();
      console.log("Order saved in DB ✔");

      return res.redirect(`${process.env.CLIENT_URL}/payment-success`);
    }

    res.redirect(`${process.env.CLIENT_URL}/cart`);
  } catch (err) {
    console.error("Stripe callback failed:", err);
    res.redirect(`${process.env.CLIENT_URL}/cart`);
  }
});

module.exports = router;
