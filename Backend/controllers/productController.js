const asyncHandler = require("express-async-handler");
const { Product } = require("../models/productModel");
const { Category } = require("../models/categoryModel");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "png": "png"
};

 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      // let uploadError = new Error('invalid image type');

      /* if(isValid) {
          uploadError = null
      } */
    cb(/* uploadError */null, 'public/uploads')
  },
  filename: function (req, file, cb) {
      
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.png`)
  }
})
const uploadOptions = multer({ storage: storage });

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
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//create product

const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.category) {
    return res.status(400).send("Invalid Category");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    sku,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;
  const skuExists = await Product.findOne({ sku });

  if (skuExists) {
    console.log("Sku already exists. Sending conflict response.");
    return res.status(409).json({ message: "Sku already exists" });
  }
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

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});
//Update product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product Id");
    }
    if (!req.body.category) {
      return res.status(400).send("Invalid Category");
    }
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send("Invalid Category");
    }
    const {
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      sku,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;
    const existingProductWithSku = await Product.findOne({ sku }).where('_id').ne(req.params.id);

    if (existingProductWithSku) {
      console.log("Sku already exists in a different product. Sending conflict response.");
      return res.status(409).json({ message: "Sku already exists in another product" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        richDescription,
        image,
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
    console.log(err);
  }
});

//delete product
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

//Product count
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
//Product featured
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
//update image
const updateImageProduct = asyncHandler(

  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    console.log("basePath", basePath); // تحقق هنا

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    console.log("imagesPaths", imagesPaths); // تحقق هنا

    console.log("req.params.id", req.params.id); // تحقق هنا

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);
module.exports = {
  getallProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  countProduct,
  featuredProduct,
  updateImageProduct,
  uploadOptions,
};
