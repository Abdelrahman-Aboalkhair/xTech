import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import { CartItem } from "@prisma/client";

interface AuthI extends Request {
  user?: { id: string };
  session?: { cart?: { [productId: string]: CartItem } };
}

const getUserCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (req.user?.id) {
    const cart = await CartService.getCart({ userId: req.user.id });
    sendResponse(res, 200, { cart }, "Cart fetched successfully");
  } else {
    if (!req.session?.cartId) {
      req.session.cartId = crypto.randomUUID();
    }

    const cart = await CartService.getCart({ cartId: req.session.cartId });
    sendResponse(res, 200, { cart }, "Guest cart fetched successfully");
  }
});

const addToCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity }: CartItem = req.body;

  if (req.user?.id) {
    const cart = await CartService.addToCart(
      {
        userId: req.user.id,
      },
      { productId, quantity }
    );
    sendResponse(res, 201, { cart }, "Product added to cart successfully");
  } else {
    if (!req.session) req.session = {};
    if (!req.session.cart) req.session.cart = {};
    const existingItem = req.session.cart[productId];
    if (existingItem) existingItem.quantity += quantity;
    else
      req.session.cart[productId] = {
        id: new Date().toISOString(),
        cartId: "guest",
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    sendResponse(
      res,
      201,
      { cart: req.session.cart },
      "Product added to guest cart successfully"
    );
  }
});

const updateCartItem = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity }: CartItem = req.body;

  if (req.user?.id) {
    const cart = await CartService.updateCartItem(
      {
        userId: req.user.id,
      },
      {
        productId,
        quantity,
      }
    );
    sendResponse(res, 200, { cart }, "Cart updated successfully");
  } else {
    if (!req.session?.cart)
      return sendResponse(res, 400, {}, "Guest cart is empty");
    const item = req.session.cart[productId];
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

const removeFromCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId }: { productId: string } = req.body;

  if (req.user?.id) {
    const cart = await CartService.removeFromCart(
      {
        userId: req.user.id,
      },
      productId
    );
    sendResponse(res, 200, { cart }, "Product removed from cart successfully");
  } else {
    if (!req.session?.cart)
      return sendResponse(res, 400, {}, "Guest cart is empty");
    delete req.session.cart[productId];
    sendResponse(
      res,
      200,
      { cart: req.session.cart },
      "Product removed from guest cart successfully"
    );
  }
});

const clearCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (req.user?.id)
    await CartService.clearCart({
      userId: req.user.id,
    });
  else {
    if (!req.session) req.session = {};
    req.session.cart = {};
  }
  sendResponse(res, 204, {}, "Cart cleared successfully");
});

const mergeGuestCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (!req.user?.id || !req.session?.cart) return;
  // await CartService.mergeGuestCartIntoUserCart(req.session.cart, req.user.id);
  req.session.cart = {};
});

export default {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
