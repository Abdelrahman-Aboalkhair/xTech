import express from "express";
import CartController from "../controllers/cartController";
// import protect from "../middlewares/protect";
// import {
//   validateAddProductToCart,
//   validateRemoveProductFromCart,
//   validateUpdateCartItem,
// } from "../validation/cartValidation";

const router = express.Router();

router.get("/", CartController.getUserCart);

// router.post("/", CartController.addToCart);

// router.put("/", validateUpdateCartItem, CartController.updateCartItem);

// router.delete(
//   "/",
//   validateRemoveProductFromCart,
//   CartController.removeFromCart
// );

// router.delete("/clear", CartController.clearCart);

// router.post("/merge", protect, CartController.mergeGuestCart);

export default router;
