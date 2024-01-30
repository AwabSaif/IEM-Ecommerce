const asyncHandler = require("express-async-handler");
const { Category } = require("../models/categoryModel");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  png: "png",
};

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
const uploadOptions = multer({ storage: storage });

//get all Categorys
const getallCategorys = asyncHandler(async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

//get Category
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  res.status(200).send(category);
});

//create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color } = req.body;

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  console.log(req.body);
  let category = new Category({
    name,
    icon: `${basePath}${fileName}`,
    color,
  });

  category = await category.save();
  if (!category) {
    return res.status(404).send("The category cannot be created!");
  }
  res.send(category);
});
//update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { name, icon, color } = req.body;

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, icon: `${basePath}${fileName}`, color },
    { new: true }
  );
  if (!category) {
    return res.status(500).send("The category cannot be updated!");
  }
  res.send(category);
});
//delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "The category is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "category not found!" });
    }
  } catch (err) {
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
