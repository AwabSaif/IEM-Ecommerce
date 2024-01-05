const asyncHandler = require("express-async-handler");
const { Product } = require("../models/productModel");
const { Category } = require("../models/categoryModel");

//get all products
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


//get product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//create
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.category) {
    return res.status(400).send("Invalid Category");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

module.exports = {
  getallProducts,
  getProduct,
  createProduct,
};
