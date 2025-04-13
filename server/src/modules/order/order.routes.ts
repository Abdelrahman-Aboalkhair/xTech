import express from "express";
import OrderController from "../controllers/orderController";
import OrderService from "../services/orderService";
import OrderRepository from "../repositories/orderRepository";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";

const router = express.Router();
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.get(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  orderController.getAllOrders
);
router.get("/user", protect, orderController.getUserOrders);
router.get("/:orderId", protect, orderController.getOrderDetails);

export default router;
