import express from "express";
import protect from "@/shared/middlewares/protect";
import { makeCheckoutController } from "./checkout.factory";

const router = express.Router();
const checkoutController = makeCheckoutController();

router.post("/", protect, checkoutController.initiateCheckout);

export default router;
