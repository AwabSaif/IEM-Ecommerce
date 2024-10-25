const express = require("express");

// Import controller functions for handling category operations
const {
  getallCategorys,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadOptions,
} = require("../controllers/categoryController");

// Create a router instance
const router = express.Router();

// Define routes and associate them with the corresponding controller functions

// Route to get all categories
router.get("/", getallCategorys);

// Route to get a specific category by its ID
router.get("/:id", getCategory);

// Route to create a new category
router.post("/", uploadOptions.single("icon"), createCategory);

// Route to delete a category by its ID
router.delete("/:id", deleteCategory);

// Route to update a category by its ID
router.put("/:id", uploadOptions.single("icon"), updateCategory);

// Export the router instance for use in other files
module.exports = router;
