const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
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
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderNumber: {
    type: Number,
    unique: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});
const createOrderNumber = (counter) => {
  // تكوين الرقم بطول ثابت 8 أرقام
  return String(counter).padStart(8, "0");
};

OrderSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      // البحث عن أعلى قيمة لرقم الأمر
      const highestOrder = await this.constructor
        .findOne({}, "orderNumber")
        .sort({ orderNumber: -1 });

      // تحديد الرقم الأولي بناءً على أعلى قيمة موجودة
      const initialOrderNumber = highestOrder
        ? highestOrder.orderNumber + 1
        : 1;

      this.orderNumber = createOrderNumber(initialOrderNumber);
    }

    next();
  } catch (error) {
    next(error);
  }
});
OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

OrderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", OrderSchema);
