import express from "express";
import PaymentController from "../controllers/paymentController";
import PaymentService from "../services/paymentService";
import PaymentRepository from "../repositories/paymentRepository";
import protect from "../middlewares/protect";
import { validateDto } from "../middlewares/validateDto";

const router = express.Router();
const paymentRepository = new PaymentRepository();
const paymentService = new PaymentService(paymentRepository);
const paymentController = new PaymentController(paymentService);

router.get("/", protect, paymentController.getUserPayments);
router.get("/:paymentId", protect, paymentController.getPaymentDetails);
router.delete("/:paymentId", protect, paymentController.deletePayment);

export default router;
