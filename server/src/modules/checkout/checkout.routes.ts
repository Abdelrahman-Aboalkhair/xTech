import express from "express";
import protect from "../middlewares/protect";
import checkoutController from "../controllers/checkoutController";

const router = express.Router();

router.post("/", protect, checkoutController.initiateCheckout);

export default router;
