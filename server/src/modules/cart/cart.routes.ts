import express from "express";
import { makeCartController } from "./cart.factory";
import optionalAuth from "@/shared/middlewares/optionalAuth";

const router = express.Router();
const cartController = makeCartController();

router.get("/", optionalAuth, cartController.getCart);
router.post("/", optionalAuth, cartController.addToCart);
router.put("/item/:itemId", optionalAuth, cartController.updateCartItem);
router.delete("/item/:itemId", optionalAuth, cartController.removeFromCart);
router.post("/merge", optionalAuth, cartController.mergeCarts);

export default router;
