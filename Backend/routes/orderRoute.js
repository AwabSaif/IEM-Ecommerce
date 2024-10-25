const express = require("express");
const router = express.Router();
const {
    getallOrder,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    totalSales,
    countOrder,
    getUserOrders,
} = require("../controllers/orderController");

// Define routes for different order operations

router.get("/", getallOrder); // Route to get all orders
router.get("/:id", getOrder); // Route to get a specific order by ID
router.post("/", createOrder); // Route to create a new order
router.put("/:id", updateOrder); // Route to update an existing order by ID
router.delete("/:id", deleteOrder); // Route to delete an order by ID
router.get("/get/totalsales", totalSales); // Route to get total sales
router.get("/get/count", countOrder); // Route to get the count of orders
router.get("/get/userorders/:userid", getUserOrders); // Route to get orders for a specific user

// Export the router instance for use in other files
module.exports = router;
