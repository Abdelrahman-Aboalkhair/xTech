import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import { Session } from "express-session";
import AppError from "../utils/AppError";
import { CartItem } from "../types/cartTypes";

interface AuthI extends Request {
  user?: { id: string };
  session: Session & {
    cart?: { id?: string; items: { [productId: string]: CartItem } };
  };
}

const getUserCart = asyncHandler(async (req: AuthI, res: Response) => {
  const cart = await CartService.getCart({
    userId: req.user?.id,
    cartId: req.session?.cart?.id,
  });
  sendResponse(res, 200, { cart }, "Cart fetched successfully");
});

const addToCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity } = req.body as CartItem;
  if (!productId || quantity <= 0) {
    throw new AppError(400, "Invalid productId or quantity");
  }

  let cart;
  if (req.user?.id) {
    cart = await CartService.addToCart(
      { userId: req.user.id },
      { productId, quantity }
    );
    sendResponse(res, 201, { cart }, "Product added to cart successfully");
  } else {
    if (!req.session.cart) {
      req.session.cart = { items: {} };
      const newCart = await CartService.getCart({}); // this will create a cart
      req.session.cart.id = newCart.id;
    }
    const guestCart = req.session.cart.items;
    const existingItem = guestCart[productId];
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      guestCart[productId] = {
        id: req.session.cart.id || "guest",
        productId,
        quantity,
      };
    }
    cart = await CartService.addToCart(
      { cartId: req.session.cart.id },
      { productId, quantity }
    );
    sendResponse(
      res,
      201,
      { cart },
      "Product added to guest cart successfully"
    );
  }
});

const updateCartItem = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId, quantity } = req.body as CartItem;
  if (!productId || quantity <= 0) {
    return sendResponse(res, 400, {}, "Invalid productId or quantity");
  }

  let cart;
  if (req.user?.id) {
    cart = await CartService.updateCartItem(
      { userId: req.user.id },
      { productId, quantity }
    );
    sendResponse(res, 200, { cart }, "Cart updated successfully");
  } else {
    if (!req.session?.cart?.items) {
      return sendResponse(res, 400, {}, "Guest cart is empty");
    }
    const item = req.session.cart.items[productId];
    if (!item) return sendResponse(res, 404, {}, "Product not found in cart");
    item.quantity = quantity;
    cart = await CartService.updateCartItem(
      { cartId: req.session.cart.id },
      { productId, quantity }
    );
    sendResponse(res, 200, { cart }, "Guest cart updated successfully");
  }
});

const removeFromCart = asyncHandler(async (req: AuthI, res: Response) => {
  const { productId } = req.body as { productId: string };
  if (!productId) {
    return sendResponse(res, 400, {}, "Invalid productId");
  }

  let cart;
  if (req.user?.id) {
    cart = await CartService.removeFromCart({ userId: req.user.id }, productId);
    sendResponse(res, 200, { cart }, "Product removed from cart successfully");
  } else {
    if (!req.session?.cart?.items) {
      return sendResponse(res, 400, {}, "Guest cart is empty");
    }
    delete req.session.cart.items[productId];
    cart = await CartService.removeFromCart(
      { cartId: req.session.cart.id },
      productId
    );
    sendResponse(
      res,
      200,
      { cart },
      "Product removed from guest cart successfully"
    );
  }
});

const clearCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (req.user?.id) {
    await CartService.clearCart({ userId: req.user.id });
  } else if (req.session?.cart) {
    req.session.cart = { items: {} };
    await CartService.clearCart({ cartId: req.session.cart.id });
  }
  sendResponse(res, 204, {}, "Cart cleared successfully");
});

const mergeGuestCart = asyncHandler(async (req: AuthI, res: Response) => {
  if (!req.user?.id || !req.session?.cart?.id) {
    return sendResponse(res, 200, {}, "No guest cart to merge");
  }
  const cart = await CartService.mergeGuestCartIntoUserCart(
    req.session.cart.id,
    req.user.id
  );
  req.session.cart = { items: {} }; // Clear session cart
  sendResponse(res, 200, { cart }, "Guest cart merged successfully");
});

export default {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
