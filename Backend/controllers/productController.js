const asyncHandler = require("express-async-handler");
const { Product } = require("../models/productModel"); // Import Product model
const { Category } = require("../models/categoryModel"); // Import Category model
const mongoose = require("mongoose");
const multer = require("multer");

// Define accepted file types for images
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  png: "png",
};

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.png`);
  },
});
const uploadOptions = multer({ storage: storage }); // Set upload options

// Middleware to get all products
const getallProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// Middleware to get a single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

// Middleware to create a product
const createProduct = asyncHandler(async (req, res) => {
  // Validate category
  if (!req.body.category) {
    return res.status(400).send("Invalid Category");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  
  // Check if image exists in the request
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  // Generate file name and base path
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  // Extract product details from request body
  const {
    name,
    description,
    richDescription,
    brand,
    price,
    sku,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  // Check if SKU already exists
  const skuExists = await Product.findOne({ sku });
  if (skuExists) {
    return res.status(409).json({ message: "Sku already exists" });
  }

  // Create new product instance
  let product = new Product({
    name,
    description,
    richDescription,
    image: `${basePath}${fileName}`,
    brand,
    price,
    sku,
    category: req.body.category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  });

  // Save product to database
  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

// Middleware to update a product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    // Validate product ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product Id");
    }
    // Validate category
    if (!req.body.category) {
      return res.status(400).send("Invalid Category");
    }
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send("Invalid Category");
    }

    // Check if image exists in the request
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    // Generate file name and base path
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    // Extract product details from request body
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      sku,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    // Check if SKU already exists in another product
    const existingProductWithSku = await Product.findOne({ sku }).where("_id").ne(req.params.id);
    if (existingProductWithSku) {
      return res.status(409).json({ message: "Sku already exists in another product" });
    }

    // Update product in the database
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        richDescription,
        image: `${basePath}${fileName}`,
        brand,
        price,
        sku,
        category: req.body.category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
      },
      { new: true }
    );
    if (!product) {
      return res.status(500).send("The product cannot be updated!");
    }

    res.send(product);
  } catch (err) {
    throw new Error(err);
  }
});

// Middleware to delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "The product is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "product not found!" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

// Middleware to count products
const countProduct = asyncHandler(async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    if (!productCount) {
      return res.status(500).json({ success: false });
    }

    res.send({ productCount: productCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// Middleware to get featured products
const featuredProduct = asyncHandler(async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
      res.status(500).json({ success: false });
    }
    res.send(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Middleware to update product images
const updateImageProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths,
    },
    { new: true }
  );

  if (!product) return res.status(500).send("the gallery cannot be updated!");

  res.send(product);
});

// Middleware to get best selling products
const bestSellers = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ sales: -1 }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Export middleware functions
module.exports = {
  getallProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  countProduct,
  featuredProduct,
  updateImageProduct,
  bestSellers,
  uploadOptions,
};
