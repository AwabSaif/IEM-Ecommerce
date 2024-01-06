const express = require("express");

const {
  getProduct,
  getallProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  countProduct,
  featuredProduct,
} = require("../controllers/productController");
const router = express.Router();
const {authJwt } = require("../middleWare/authMiddleWare");

router.use(authJwt);

router.get("/", getallProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/count", countProduct);
router.get("/get/featured/:count", featuredProduct);

module.exports = router;
