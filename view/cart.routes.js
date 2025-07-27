const express = require("express");
const router = express.Router();
const Cart = require("../model/cart.model");
const { addToCart, deleteFromCart, getCart } = require("../controller/cart.controller")
const { verifyToken } = require("../utils/jwt.security");
// Add to cart
router.post("/addtocart/:userId", verifyToken, addToCart)

// Delete From Cart
router.delete("/delete/:userId", verifyToken, deleteFromCart)


// Fetch Cart
router.get("/:userId", getCart);

module.exports = router;