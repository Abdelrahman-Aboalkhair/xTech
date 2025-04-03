import express from "express";
import CartController from "../controllers/cartController";
import {
  validateAddProductToCart,
  validateRemoveProductFromCart,
  validateUpdateCartItem,
} from "../validation/cartValidation";
import optionalAuth from "../middlewares/optionalAuth";

const router = express.Router();

router.get("/", optionalAuth, CartController.getUserCart);

router.post("/", CartController.addToCart);

router.put("/", validateUpdateCartItem, CartController.updateCartItem);

router.delete(
  "/",
  validateRemoveProductFromCart,
  CartController.removeFromCart
);

router.delete("/clear", CartController.clearCart);

export default router;
