import express from "express";
import CartController from "../controllers/cartController";
import { validateDto } from "../middlewares/validateDto";
import optionalAuth from "../middlewares/optionalAuth";
import {
  AddToCartDto,
  UpdateCartItemDto,
  RemoveFromCartDto,
} from "../dtos/cartDto";

const router = express.Router();

router.get("/", optionalAuth, CartController.getUserCart);

router.post(
  "/",
  optionalAuth,
  validateDto(AddToCartDto),
  CartController.addToCart
);

router.put("/", validateDto(UpdateCartItemDto), CartController.updateCartItem);

router.delete(
  "/",
  validateDto(RemoveFromCartDto),
  CartController.removeFromCart
);

router.delete("/clear", CartController.clearCart);

export default router;
