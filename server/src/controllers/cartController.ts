import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import { Session } from "express-session";
import AppError from "../utils/AppError";
import { CartItem } from "../types/cartTypes";

interface AuthI extends Request {
  user?: { id: string; role: string };
  session: Session & {
    cart?: { id?: string; items: { [productId: string]: CartItem } };
  };
}

class CartController {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  getUserCart = asyncHandler(
    async (req: AuthI, res: Response): Promise<void> => {
      const cart = await this.cartService.getCart({
        userId: req.user?.id,
        cartId: req.session?.cart?.id,
      });
      sendResponse(res, 200, { cart }, "Cart fetched successfully");
    }
  );

  addToCart = asyncHandler(async (req: AuthI, res: Response): Promise<void> => {
    const { productId, quantity } = req.body as CartItem;
    if (!productId || quantity <= 0) {
      throw new AppError(400, "Invalid productId or quantity");
    }

    let cart;
    if (req.user?.id) {
      cart = await this.cartService.addToCart(
        { userId: req.user.id },
        { productId, quantity }
      );
      sendResponse(res, 201, { cart }, "Product added to cart successfully");
    } else {
      if (!req.session.cart) {
        req.session.cart = { items: {} };
        const newCart = await this.cartService.getCart({});
        req.session.cart.id = newCart.id;
      }
      cart = await this.cartService.addToCart(
        { cartId: req.session.cart.id },
        { productId, quantity }
      );
      req.session.cart.items[productId] = { productId, quantity };
      sendResponse(
        res,
        201,
        { cart },
        "Product added to guest cart successfully"
      );
    }
  });

  updateCartItem = asyncHandler(
    async (req: AuthI, res: Response): Promise<void> => {
      const { productId, quantity } = req.body as CartItem;
      if (!productId || quantity <= 0) {
        throw new AppError(400, "Invalid productId or quantity");
      }

      let cart;
      if (req.user?.id) {
        cart = await this.cartService.updateCartItem(
          { userId: req.user.id },
          { productId, quantity }
        );
        sendResponse(res, 200, { cart }, "Cart updated successfully");
      } else {
        if (!req.session?.cart?.id) {
          throw new AppError(400, "Guest cart not initialized");
        }
        cart = await this.cartService.updateCartItem(
          { cartId: req.session.cart.id },
          { productId, quantity }
        );
        if (quantity > 0) {
          req.session.cart.items[productId] = { productId, quantity };
        } else {
          delete req.session.cart.items[productId];
        }
        sendResponse(res, 200, { cart }, "Guest cart updated successfully");
      }
    }
  );

  removeFromCart = asyncHandler(
    async (req: AuthI, res: Response): Promise<void> => {
      const { productId } = req.body as { productId: string };
      if (!productId) {
        throw new AppError(400, "Invalid productId");
      }

      let cart;
      if (req.user?.id) {
        cart = await this.cartService.removeFromCart(
          { userId: req.user.id },
          productId
        );
        sendResponse(
          res,
          200,
          { cart },
          "Product removed from cart successfully"
        );
      } else {
        if (!req.session?.cart?.id) {
          throw new AppError(400, "Guest cart not initialized");
        }
        cart = await this.cartService.removeFromCart(
          { cartId: req.session.cart.id },
          productId
        );
        delete req.session.cart.items[productId];
        sendResponse(
          res,
          200,
          { cart },
          "Product removed from guest cart successfully"
        );
      }
    }
  );

  clearCart = asyncHandler(async (req: AuthI, res: Response): Promise<void> => {
    if (req.user?.id) {
      await this.cartService.clearCart({ userId: req.user.id });
    } else if (req.session?.cart?.id) {
      await this.cartService.clearCart({ cartId: req.session.cart.id });
      req.session.cart = { items: {} };
    } else {
      throw new AppError(400, "No cart to clear");
    }
    sendResponse(res, 204, {}, "Cart cleared successfully");
  });

  mergeGuestCart = asyncHandler(
    async (req: AuthI, res: Response): Promise<void> => {
      if (!req.user?.id || !req.session?.cart?.id) {
        sendResponse(res, 200, {}, "No guest cart to merge");
        return;
      }
      const cart = await this.cartService.mergeGuestCartIntoUserCart(
        req.session.cart.id,
        req.user.id
      );
      req.session.cart = { items: {} };
      sendResponse(res, 200, { cart }, "Guest cart merged successfully");
    }
  );
}

export default new CartController(new CartService());
