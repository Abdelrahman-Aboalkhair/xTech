import express from "express";
import OrderController from "../controllers/orderController";
import OrderService from "../services/orderService";
import OrderRepository from "../repositories/orderRepository";
import protect from "../middlewares/protect";

const router = express.Router();
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.get("/orders", protect, orderController.getUserOrders);
router.get("/orders/:orderId", protect, orderController.getOrderDetails);
router.patch(
  "/orders/:orderId/tracking",
  protect,
  orderController.updateTrackingStatus
);

export default router;
