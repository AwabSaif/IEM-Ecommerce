const mongoose = require("mongoose");

// Define the schema for the Order model
const OrderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem", // Reference to the OrderItem model
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending Payment", // Default status
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    require: true,
  },
  payment: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    default: "usd", // Default currency
  },
  orderNumber: {
    type: Number,
    unique: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now, // Default date when the order was placed
  },
});

// Function to create an order number based on a counter
const createOrderNumber = (counter) => {
  return String(counter).padStart(8, "0"); // Pad the order number to 8 digits
};

// Middleware to generate order number before saving the order
OrderSchema.pre("save", async function (next) {
  try {
    // If the order doesn't have an order number yet, generate one
    if (!this.orderNumber) {
      // Find the highest order number
      const highestOrder = await this.constructor
        .findOne({}, "orderNumber")
        .sort({ orderNumber: -1 });

      // Calculate the initial order number based on the highest order number found
      const initialOrderNumber = highestOrder
        ? highestOrder.orderNumber + 1
        : 1;

      // Generate the order number
      this.orderNumber = createOrderNumber(initialOrderNumber);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Define a virtual field 'id' to convert _id to hexadecimal string
OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Configure toJSON option to include virtual fields
OrderSchema.set("toJSON", {
  virtuals: true,
});

// Create and export the Order model based on the schema
exports.Order = mongoose.model("Order", OrderSchema);
