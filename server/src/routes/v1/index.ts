import { Router } from "express";
import usersRoutes from "@/modules/user/user.routes";
import authRoutes from "@/modules/auth/auth.routes";
import productRoutes from "@/modules/product/product.routes";
import reviewRoutes from "@/modules/review/review.routes";
import categoryRoutes from "@/modules/category/category.routes";
import orderRoutes from "@/modules/order/order.routes";
import checkoutRoutes from "@/modules/checkout/checkout.routes";
import webhookRoutes from "@/modules/webhook/webhook.routes";
import cartRoutes from "@/modules/cart/cart.routes";
import reportRoutes from "@/modules/reports/reports.routes";
import analyticsRoutes from "@/modules/analytics/analytics.routes";
import paymentRoutes from "@/modules/payment/payment.routes";
import addressRoutes from "@/modules/address/address.routes";
import shipmentRoutes from "@/modules/shipment/shipment.routes";
import transactionRoutes from "@/modules/transaction/transaction.routes";
import logRoutes from "@/modules/logs/logs.routes";
import bodyParser from "body-parser";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/reviews", reviewRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/reports", reportRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/logs", logRoutes);
router.use(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookRoutes
);

export default router;
