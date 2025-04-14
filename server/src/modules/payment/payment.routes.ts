import express from "express";
import protect from "@/shared/middlewares/protect";
import { makePaymentController } from "./payment.factory";

const router = express.Router();
const paymentController = makePaymentController();
router.get("/", protect, paymentController.getUserPayments);
router.get("/:paymentId", protect, paymentController.getPaymentDetails);
router.delete("/:paymentId", protect, paymentController.deletePayment);

export default router;
