const express = require("express");

const {
  getallCategorys,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const router = express.Router();

router.get("/", getallCategorys);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);

module.exports = router;
