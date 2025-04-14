import express from "express";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { makeOrderController } from "./order.factory";

const router = express.Router();
const orderController = makeOrderController();

router.get(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  orderController.getAllOrders
);
router.get("/user", protect, orderController.getUserOrders);
router.get("/:orderId", protect, orderController.getOrderDetails);

export default router;
