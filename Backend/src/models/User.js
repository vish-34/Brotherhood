const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    likedProducts: [
  {
    productId: Number,
    name: String,
    price: Number,
    image: String,
  },
],

cart: [
  {
    productId: Number,
    name: String,
    price: Number,
    image: String,
    size: String,
    quantity: Number,
  },
],

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
