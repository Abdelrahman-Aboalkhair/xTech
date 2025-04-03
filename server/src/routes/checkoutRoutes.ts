import express from "express";
import CheckoutController from "../controllers/checkoutController";
import CheckoutService from "../services/checkoutService";
import CheckoutRepository from "../repositories/checkoutRepository";
import protect from "../middlewares/protect";

const router = express.Router();
const checkoutRepository = new CheckoutRepository();
const checkoutService = new CheckoutService(checkoutRepository);
const checkoutController = new CheckoutController(checkoutService);

router.post("/", protect, checkoutController.initiateCheckout);

export default router;
