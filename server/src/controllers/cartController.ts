import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";
import AppError from "../utils/AppError";
import { CartItem } from "../types/cartTypes";

class CartController {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  getUserCart = asyncHandler(async (req: Request, res: Response) => {
    let cart;
    if (req.user?.id) {
      console.log("User ID:", req.user.id);
      cart = await this.cartService.getCart({ userId: req.user.id });
      console.log("Found cart for logged in user: ", cart);
    } else if (req.session.cart?.id) {
      cart = await this.cartService.getCart({ cartId: req.session.cart.id });
    } else {
      cart = await this.cartService.getCart({}); // Create a new cart for guests if none exists
      req.session.cart = { id: cart.id, items: [] };
    }
    sendResponse(res, 200, { cart }, "Cart fetched successfully");
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    console.log("Session ID:", req.sessionID);
    console.log("Cart ID before:", req.session.cart?.id);

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
      if (!req.session.cart || !req.session.cart.id) {
        // Create a new cart if none exists in the session
        // No userId or cartId, creates a fresh cart
        const newCart = await this.cartService.getCart({});
        req.session.cart = { id: newCart.id, items: [] };
      }

      // Add the item to the cart using the session's cart ID
      cart = await this.cartService.addToCart(
        { cartId: req.session.cart.id },
        { productId, quantity }
      );

      console.log("Cart ID after:", req.session.cart.id);

      // Update session items to reflect the cart state
      const existingItemIndex = req.session.cart.items.findIndex(
        (item) => item.product === productId
      );
      if (existingItemIndex >= 0) {
        req.session.cart.items[existingItemIndex].quantity += quantity;
      } else {
        req.session.cart.items.push({ product: productId, quantity });
        console.log("req.session.items after push =>", req.session.cart.items);
      }

      sendResponse(
        res,
        201,
        { cart },
        "Product added to guest cart successfully"
      );
    }
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
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
      if (!req.session.cart?.id) {
        throw new AppError(400, "Guest cart not initialized");
      }
      cart = await this.cartService.updateCartItem(
        { cartId: req.session.cart.id },
        { productId, quantity }
      );

      if (!req.session.cart.items) {
        req.session.cart.items = [];
      }

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

      sendResponse(res, 200, { cart }, "Guest cart updated successfully");
    }
  });

  removeFromCart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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
        if (!req.session.cart?.id) {
          throw new AppError(400, "Guest cart not initialized");
        }
        cart = await this.cartService.removeFromCart(
          { cartId: req.session.cart.id },
          productId
        );

        if (req.session.cart.items) {
          req.session.cart.items = req.session.cart.items.filter(
            (item) => item.product !== productId
          );
        }

        sendResponse(
          res,
          200,
          { cart },
          "Product removed from guest cart successfully"
        );
      }
    }
  );

  clearCart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (req.user?.id) {
        await this.cartService.clearCart({ userId: req.user.id });
      } else if (req.session.cart?.id) {
        await this.cartService.clearCart({ cartId: req.session.cart.id });
        req.session.cart = { id: "", items: [] };
      } else {
        sendResponse(res, 200, {}, "No cart to clear");
      }
      sendResponse(res, 200, {}, "Cart cleared successfully");
    }
  );
}

export default new CartController(new CartService());
