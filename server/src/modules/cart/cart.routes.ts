import express from "express";
import cartController from "../controllers/cartController";
import optionalAuth from "../middlewares/optionalAuth";

const router = express.Router();

router.get("/", optionalAuth, cartController.getCart);
router.post("/", optionalAuth, cartController.addToCart);
router.put("/item/:itemId", optionalAuth, cartController.updateCartItem);
router.delete("/item/:itemId", optionalAuth, cartController.removeFromCart);
router.post("/merge", optionalAuth, cartController.mergeCarts);

export default router;
