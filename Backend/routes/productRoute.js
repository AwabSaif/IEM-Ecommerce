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

router.get("/", getallProducts);
router.get("/:id", getProduct);
router.post("/", uploadOptions.single("image"), createProduct);
router.put("/:id", uploadOptions.single("image"), updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/count", countProduct);
router.get("/get/featured/:count", featuredProduct);
router.get("/get/best-sellers", bestSellers);
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  updateImageProduct
);

module.exports = router;
