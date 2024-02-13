const mongoose = require("mongoose");

// Define the schema for the Product model
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
    },
    description: {
      type: String,
      required: true, // Description is required
    },
    richDescription: {
      type: String,
      default: "", // Default rich description is empty string
    },
    image: {
      type: String,
      default: "", // Default image is empty string
    },
    images: [
      {
        type: String,
        default: "", // Default images array is empty
      },
    ],
    brand: {
      type: String,
      default: "", // Default brand is empty string
    },
    price: {
      type: Number,
      default: 0, // Default price is 0
    },
    sku: {
      type: String,
      default: "", // Default SKU is empty string
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
      ref: "Category", // Name of the referenced model
      required: true, // Category is required
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0, // Minimum count in stock is 0
    },
    sales: {
      type: Number,
      min: 0, // Minimum sales is 0
    },
    rating: {
      type: Number,
      default: 0, // Default rating is 0
    },
    numReviews: {
      type: Number,
      default: 0, // Default number of reviews is 0
    },
    isFeatured: {
      type: Boolean,
      default: false, // Default is not featured
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Define a virtual field 'id' to convert _id to hexadecimal string
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Configure toJSON option to include virtual fields
productSchema.set("toJSON", {
  virtuals: true,
});

// Create and export the Product model based on the schema
exports.Product = mongoose.model("Product", productSchema);
