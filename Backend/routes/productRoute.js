const express = require("express");


const { getProduct,getallProducts, createProduct,  } = require("../controllers/productController");
const router = express.Router();

router.get("/", getallProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);

module.exports = router;
