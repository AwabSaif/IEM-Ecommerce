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





router.get("/", getallOrder);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/get/totalsales", totalSales);
router.get("/get/count", countOrder);
router.get("/get/userorders/:userid", getUserOrders);


module.exports = router;
