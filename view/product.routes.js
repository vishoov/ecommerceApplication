const express = require("express");
const router = express.Router();
const { createProduct, getProductById, updateProduct, deleteProduct, searchProduct } = require("../controller/product.controller");


// Create product /createproduct
router.post("/createproduct", createProduct)
// Fetch Product /product
router.get("/product/:id", getProductById)
// Update Product /updateProduct
router.put("/updateproduct/:id", updateProduct)
// Delete Product /deleteProduct
router.delete("/deleteproduct/:id", deleteProduct)
// Search /searchProduct
router.get("/searchproduct", searchProduct)


module.exports = router;