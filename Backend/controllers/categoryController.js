const asyncHandler = require("express-async-handler");
const { Category } = require("../models/categoryModel");
const multer = require("multer");

// Define file type mappings for multer
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  png: "png",
};

// Define multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if file type is valid
    const isValid = FILE_TYPE_MAP[file.mimetype];
    // Set destination folder for file upload
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    // Generate unique filename for uploaded file
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    // Set filename with timestamp to avoid duplicates
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

// Initialize multer with storage options
const uploadOptions = multer({ storage: storage });

// Get all categories
const getallCategorys = asyncHandler(async (req, res) => {
  // Retrieve all categories from the database
  const categoryList = await Category.find();
  // Check if categories exist
  if (!categoryList) {
    // If no categories found, send server error response
    res.status(500).json({ success: false });
  }
  // If categories found, send category list in the response
  res.status(200).send(categoryList);
});

// Get a specific category by ID
const getCategory = asyncHandler(async (req, res) => {
  // Retrieve the category with the given ID
  const category = await Category.findById(req.params.id);
  // Check if the category exists
  if (!category) {
    // If category not found, send error message in the response
    res.status(500).json({ message: "The category with the given ID was not found." });
  }
  // If category found, send category details in the response
  res.status(200).send(category);
});

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  // Extract category details from the request body
  const { name, icon, color } = req.body;

  // Get uploaded file
  const file = req.file;
  // Check if file exists in the request
  if (!file) return res.status(400).send("No image in the request");

  // Generate file path and name
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  // Create a new category instance with image path
  let category = new Category({
    name,
    icon: `${basePath}${fileName}`,
    color,
  });

  // Save the new category to the database
  category = await category.save();
  // Check if category is successfully created and send response accordingly
  if (!category) {
    return res.status(404).send("The category cannot be created!");
  }
  res.send(category);
});

// Update an existing category
const updateCategory = asyncHandler(async (req, res) => {
  // Extract category details from the request body
  const { name, icon, color } = req.body;

  // Get uploaded file
  const file = req.file;
  // Check if file exists in the request
  if (!file) return res.status(400).send("No image in the request");

  // Generate file path and name
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  // Find and update the category with the given ID
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, icon: `${basePath}${fileName}`, color },
    { new: true }
  );
  // Check if category is successfully updated and send response accordingly
  if (!category) {
    return res.status(500).send("The category cannot be updated!");
  }
  res.send(category);
});

// Delete an existing category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    // Find and delete the category with the given ID
    const category = await Category.findByIdAndDelete(req.params.id);
    // Check if category exists and send response accordingly
    if (category) {
      return res.status(200).json({ success: true, message: "The category is deleted!" });
    } else {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }
  } catch (err) {
    // Send server error response if an error occurs during deletion
    return res.status(500).json({ success: false, error: err });
  }
});

module.exports = {
  getallCategorys,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadOptions,
};
