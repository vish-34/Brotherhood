const express = require("express");
const protect = require("../middlewares/authMiddlewares");
const User = require("../models/User");

const router = express.Router();

/* GET CURRENT USER DATA */
router.get("/me", protect, async (req, res) => {
  res.json({
    likedProducts: req.user.likedProducts,
    cart: req.user.cart,
  });
});


/* LIKE / UNLIKE */
router.post("/like", protect, async (req, res) => {
  const { product } = req.body;
  const user = await User.findById(req.user._id);

  const exists = user.likedProducts.find(
    (p) => p.productId === product.id
  );

  if (exists) {
    user.likedProducts = user.likedProducts.filter(
      (p) => p.productId !== product.id
    );
  } else {
    user.likedProducts.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  await user.save();
  res.json(user.likedProducts);
});

/* ADD TO CART */
router.post("/cart", protect, async (req, res) => {
  const { product, size } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find(
    (p) => p.productId === product.id && p.size === size
  );

  if (item) {
    item.quantity += 1;
  } else {
    user.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      quantity: 1,
    });
  }

  await user.save();
  res.json(user.cart);
});

module.exports = router;
