const router = require("express").Router();

const { createOrder, cancelOrder, trackOrder } = require("../controller/order.controller");


router.post("/create/:userId", createOrder);

//cancel order

router.put("/cancel/:orderId", cancelOrder)


router.get("/track/:orderId", trackOrder)

module.exports = router;