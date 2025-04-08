import express from "express";
import cartController from "../controllers/cartController";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/item/:itemId", cartController.updateCartItem);
router.delete("/item/:itemId", cartController.removeFromCart);
router.post("/merge", cartController.mergeCarts);

export default router;
