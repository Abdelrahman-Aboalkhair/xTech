import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import AppError from "../utils/AppError";
import { CartItem } from "../types/cartTypes";
import { getEffectiveCart } from "../utils/cartUtils";
import {
  AddToCartDto,
  UpdateCartItemDto,
  RemoveFromCartDto,
} from "../dtos/cartDto";

class CartController {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  getUserCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await getEffectiveCart(req, this.cartService);
    sendResponse(res, 200, { cart }, "Cart fetched successfully");
  });

  addToCart = asyncHandler(
    async (req: Request<any, any, AddToCartDto>, res: Response) => {
      const { productId, quantity } = req.body;

      if (!productId || quantity <= 0) {
        throw new AppError(400, "Invalid productId or quantity");
      }

      const cart = await getEffectiveCart(req, this.cartService);

      const updatedCart = await this.cartService.addToCart(
        cart.userId ? { userId: cart.userId } : { cartId: cart.id },
        { productId, quantity }
      );

      if (!req.user && req.session.cart?.items) {
        const existingItemIndex = req.session.cart.items.findIndex(
          (item) => item.product === productId
        );

        if (existingItemIndex >= 0) {
          req.session.cart.items[existingItemIndex].quantity += quantity;
        } else {
          req.session.cart.items.push({ product: productId, quantity });
        }
      }

      sendResponse(
        res,
        201,
        { cart: updatedCart },
        "Product added to cart successfully"
      );
    }
  );

  updateCartItem = asyncHandler(
    async (req: Request<any, any, UpdateCartItemDto>, res: Response) => {
      const { productId, quantity } = req.body;

      if (!productId || quantity < 0) {
        // Adjusted to < 0 since DTO allows 0
        throw new AppError(400, "Invalid productId or quantity");
      }

      const cart = await getEffectiveCart(req, this.cartService);

      const updatedCart = await this.cartService.updateCartItem(
        cart.userId ? { userId: cart.userId } : { cartId: cart.id },
        { productId, quantity }
      );

      if (!req.user && req.session.cart) {
        const itemIndex = req.session.cart.items.findIndex(
          (item) => item.product === productId
        );

        if (quantity > 0) {
          if (itemIndex >= 0) {
            req.session.cart.items[itemIndex].quantity = quantity;
          } else {
            req.session.cart.items.push({ product: productId, quantity });
          }
        } else if (itemIndex >= 0) {
          req.session.cart.items.splice(itemIndex, 1);
        }
      }

      sendResponse(
        res,
        200,
        { cart: updatedCart },
        "Cart updated successfully"
      );
    }
  );

  removeFromCart = asyncHandler(
    async (req: Request<any, any, RemoveFromCartDto>, res: Response) => {
      const { productId } = req.body;

      if (!productId) {
        throw new AppError(400, "Invalid productId");
      }

      const cart = await getEffectiveCart(req, this.cartService);

      const updatedCart = await this.cartService.removeFromCart(
        cart.userId ? { userId: cart.userId } : { cartId: cart.id },
        productId
      );

      if (!req.user && req.session.cart?.items) {
        req.session.cart.items = req.session.cart.items.filter(
          (item) => item.product !== productId
        );
      }

      sendResponse(
        res,
        200,
        { cart: updatedCart },
        "Product removed from cart successfully"
      );
    }
  );

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await getEffectiveCart(req, this.cartService);

    await this.cartService.clearCart(
      cart.userId ? { userId: cart.userId } : { cartId: cart.id }
    );

    if (!req.user) {
      req.session.cart = { id: "", items: [] };
    }

    sendResponse(res, 200, {}, "Cart cleared successfully");
  });
}

export default new CartController(new CartService());
