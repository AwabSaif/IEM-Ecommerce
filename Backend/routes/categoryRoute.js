const express = require("express");

const {
  getallCategorys,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadOptions,
} = require("../controllers/categoryController");
const router = express.Router();

router.get("/", getallCategorys);
router.get("/:id", getCategory);
router.post("/", uploadOptions.single("icon"), createCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", uploadOptions.single("icon"), updateCategory);

module.exports = router;
