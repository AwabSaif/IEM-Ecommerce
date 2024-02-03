const asyncHandler = require("express-async-handler");
const { Order } = require("../models/orderMode");
const { OrderItem } = require("../models/orderItemModel");
const { Product } = require("../models/productModel");

//get all Order
const getallOrder = asyncHandler(async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(orderList);
});
//get  Order
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email city street zip apartment")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  } else {
    res.send(order);
  }
});

//create Order
const createOrder = asyncHandler(async (req, res) => {
  const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
          let newOrderItem = new OrderItem({
              quantity: orderItem.quantity,
              product: orderItem.product,
          });
          newOrderItem = await newOrderItem.save();
          return newOrderItem._id;
      })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");

          const totalPrice = orderItem.product.price * orderItem.quantity;
          return totalPrice;
      })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let updatedCountInStock = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate('product', 'countInStock sales');

          // update countInStock
          const updatedProduct = await Product.findByIdAndUpdate(
              orderItem.product._id,
              {
                  $inc: { countInStock: -orderItem.quantity },
              },
              { new: true }
          );

          // update sales
          if (updatedProduct) {
              updatedProduct.sales = (updatedProduct.sales || 0) + orderItem.quantity;
              await updatedProduct.save();
          } else {
              console.error(`Failed to update product stock and sales for order item ${orderItemId}`);
          }

          return orderItem;
      })
  );

  const {
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user,
      payment,
      currency,
  } = req.body;

  let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice: totalPrice,
      user,
      payment,
      currency,
  });

  order = await order.save();
  if (!order) {
      return res.status(404).send("The order cannot be created!");
  }

  res.send(order);
});

//Update order status
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) {
    return res.status(500).send("The order cannot be updated!");
  }
  res.send(order);
});

//delete order
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      const deleteOrderItemsPromises = order.orderItems.map(
        async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        }
      );

      await Promise.all(deleteOrderItemsPromises);

      res.status(200).json({ success: true, message: "The order is deleted!" });
    } else {
      res.status(404).json({ success: false, message: "Order not found!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//get totalsales
const totalSales = asyncHandler(async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.send({ totalSales: totalSales.pop().totalSales });
});

//Order count
const countOrder = asyncHandler(async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      return res.status(500).json({ success: false });
    }

    res.send({ orderCount: orderCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

//Get Order user /get/userorders/:userid
const getUserOrders = asyncHandler(async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = {
  getallOrder,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  countOrder,
  getUserOrders,
};
