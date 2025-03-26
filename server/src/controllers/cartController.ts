import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import { CartItem } from "@prisma/client";

interface AuthI extends Request {
  user?: { id: string };
  session?: { cart?: CartItem[] };
}

// Get all carts (Admin & SuperAdmin only)
const getAllCarts = asyncHandler(async (req: Request, res: Response) => {
  const carts = await CartService.getAllCarts();
  sendResponse(res, 200, { carts }, "All carts retrieved successfully");
});

// Get user-specific cart (Authenticated or Guest)
const getUserCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (req.user?.id) {
    const cart = await CartService.getCart(req.user.id);
    sendResponse(res, 200, { cart }, "Cart fetched successfully");
  } else {
    sendResponse(
      res,
      200,
      { cart: req.session?.cart || [] },
      "Guest cart fetched successfully"
    );
  }
});

// Add product to cart
const addToCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity }: CartItem = req.body;

  if (req.user?.id) {
    const cart = await CartService.addToCart(req.user.id, productId, quantity);
    sendResponse(res, 201, { cart }, "Product added to cart successfully");
  } else {
    if (!req.session) req.session = {};
    if (!req.session.cart) req.session.cart = [];
    const existingItem = req.session.cart.find(
      (item) => item.productId === productId
    );
    if (existingItem) existingItem.quantity += quantity;
    else req.session.cart.push({ productId, quantity });
    sendResponse(
      res,
      201,
      { cart: req.session.cart },
      "Product added to guest cart successfully"
    );
  }
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity }: CartItem = req.body;

  if (req.user?.id) {
    const cart = await CartService.updateCartItem(
      req.user.id,
      productId,
      quantity
    );
    sendResponse(res, 200, { cart }, "Cart updated successfully");
  } else {
    if (!req.session?.cart)
      return sendResponse(res, 400, {}, "Guest cart is empty");
    const item = req.session.cart.find((item) => item.productId === productId);
    if (!item) return sendResponse(res, 404, {}, "Product not found in cart");
    item.quantity = quantity;
    sendResponse(
      res,
      200,
      { cart: req.session.cart },
      "Guest cart updated successfully"
    );
  }
});

// Remove product from cart
const removeFromCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId }: { productId: string } = req.body;

  if (req.user?.id) {
    const cart = await CartService.removeFromCart(req.user.id, productId);
    sendResponse(res, 200, { cart }, "Product removed from cart successfully");
  } else {
    if (!req.session?.cart)
      return sendResponse(res, 400, {}, "Guest cart is empty");
    req.session.cart = req.session.cart.filter(
      (item) => item.productId !== productId
    );
    sendResponse(
      res,
      200,
      { cart: req.session.cart },
      "Product removed from guest cart successfully"
    );
  }
});

// Clear entire cart
const clearCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (req.user?.id) await CartService.clearCart(req.user.id);
  else req.session.cart = [];
  sendResponse(res, 204, {}, "Cart cleared successfully");
});

// Merge guest cart with authenticated user cart after login
const mergeGuestCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (!req.user?.id || !req.session?.cart) return;
  await CartService.mergeGuestCart(req.user.id, req.session.cart);
  req.session.cart = [];
});

export default {
  getAllCarts,
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
