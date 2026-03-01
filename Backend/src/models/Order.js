const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      id: String,
      name: String,
      size: String,
      price: Number,
      quantity: Number,
      subtotal: Number,
    }
  ],
  totalAmount: Number,
  paymentTime: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
