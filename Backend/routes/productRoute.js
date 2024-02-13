const express = require("express");
const {
    getProduct,
    getallProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    countProduct,
    featuredProduct,
    updateImageProduct,
    bestSellers,
    uploadOptions,
} = require("../controllers/productController");
const multer = require("multer");

const router = express.Router();

// Define routes for different product operations
router.get("/", getallProducts); // Route to get all products
router.get("/:id", getProduct); // Route to get a specific product by ID
router.post("/", uploadOptions.single("image"), createProduct); // Route to create a new product
router.put("/:id", uploadOptions.single("image"), updateProduct); // Route to update an existing product by ID
router.delete("/:id", deleteProduct); // Route to delete a product by ID
router.get("/get/count", countProduct); // Route to get the count of products
router.get("/get/featured/:count", featuredProduct); // Route to get featured products
router.get("/get/best-sellers", bestSellers); // Route to get best-selling products
router.put("/gallery-images/:id", uploadOptions.array("images", 10), updateImageProduct); // Route to update product gallery images

module.exports = router;
