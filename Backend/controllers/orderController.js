const asyncHandler = require("express-async-handler");
const { Order } = require("../models/orderMode");
const { OrderItem } = require("../models/orderItemModel");
const { Product } = require("../models/productModel");

// Get all orders
const getallOrder = asyncHandler(async (req, res) => {
  // Retrieve all orders from the database and populate the 'user' field with only 'name'
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  // Check if there are any orders
  if (!orderList) {
    // If no orders found, send a server error response
    res.status(500).json({ success: false });
  }
  // If orders found, send the order list in the response
  res.status(200).send(orderList);
});

// Get a specific order by ID
const getOrder = asyncHandler(async (req, res) => {
  // Retrieve the order with the given ID and populate 'user' with additional details
  const order = await Order.findById(req.params.id)
    .populate("user", "name email city street zip apartment")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  // Check if the order exists
  if (!order) {
    // If order not found, send a server error response
    res.status(500).json({ success: false });
  } else {
    // If order found, send the order details in the response
    res.send(order);
  }
});

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  // Extract order items from the request body and save them to the database
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

  // Calculate total price for the order based on order items
  const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");

          const totalPrice = orderItem.product.price * orderItem.quantity;
          return totalPrice;
      })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  // Update stock count and sales for each ordered product
  let updatedCountInStock = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate('product', 'countInStock sales');

          const updatedProduct = await Product.findByIdAndUpdate(
              orderItem.product._id,
              {
                  $inc: { countInStock: -orderItem.quantity },
              },
              { new: true }
          );

          if (updatedProduct) {
              updatedProduct.sales = (updatedProduct.sales || 0) + orderItem.quantity;
              await updatedProduct.save();
          } else {
              console.error(`Failed to update product stock and sales for order item ${orderItemId}`);
          }

          return orderItem;
      })
  );

  // Create a new order instance and save it to the database
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
      orderItems: orderItemsIds,
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

  // Check if the order is successfully created and send response accordingly
  if (!order) {
      return res.status(404).send("The order cannot be created!");
  }

  res.send(order);
});

// Update order status
const updateOrder = asyncHandler(async (req, res) => {
  // Find and update the order status by ID
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  // Check if the order exists and send response accordingly
  if (!order) {
    return res.status(500).send("The order cannot be updated!");
  }
  res.send(order);
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    // Find and delete the order by ID
    const order = await Order.findByIdAndDelete(req.params.id);

    // Check if the order exists
    if (order) {
      // Delete associated order items
      const deleteOrderItemsPromises = order.orderItems.map(
        async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        }
      );

      await Promise.all(deleteOrderItemsPromises);

      // Send success message if the order is deleted
      res.status(200).json({ success: true, message: "The order is deleted!" });
    } else {
      // Send error message if the order is not found
      res.status(404).json({ success: false, message: "Order not found!" });
    }
  } catch (err) {
    // Send server error response if an error occurs during deletion
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get total sales
const totalSales = asyncHandler(async (req, res) => {
  // Calculate total sales by aggregating order prices
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    // Send error response if total sales cannot be generated
    return res.status(400).send("The order sales cannot be generated");
  }
  // Send total sales in the response
  res.send({ totalSales: totalSales.pop().totalSales });
});

// Get count of orders
const countOrder = asyncHandler(async (req, res) => {
  try {
    // Count total number of orders
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      // Send server error response if no orders found
      return res.status(500).json({ success: false });
    }

    // Send order count in the response
    res.send({ orderCount: orderCount });
  } catch (err) {
    // Send server error response if an error occurs
    res.status(500).json({ success: false, error: err });
  }
});

// Get orders by user ID
const getUserOrders = asyncHandler(async (req, res) => {
  // Retrieve orders associated with the specified user ID
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  // Check if user orders exist
  if (!userOrderList) {
    // Send server error response if no orders found
    res.status(500).json({ success: false });
  }
  // Send user orders in the response
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
