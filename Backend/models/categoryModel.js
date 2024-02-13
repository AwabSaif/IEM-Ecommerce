const mongoose = require("mongoose");

// Define the schema for the category
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  icon: {
    type: String, // Icon is optional
  },
  color: {
    type: String, // Color is optional
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Define a virtual field 'id' to convert _id to hexadecimal string
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Configure toJSON option to include virtual fields
categorySchema.set('toJSON', {
  virtuals: true,
});

// Create and export the Category model based on the schema
exports.Category = mongoose.model('Category', categorySchema);
