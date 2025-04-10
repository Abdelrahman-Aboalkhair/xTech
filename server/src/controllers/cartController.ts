import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CartService from "../services/cartService";

class CartController {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.session.id;

    const cart = await this.cartService.getOrCreateCart(userId, sessionId);

    sendResponse(res, 200, { cart }, "Cart fetched successfully");
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.session.id;
    const { productId, quantity } = req.body;

    const item = await this.cartService.addToCart(
      productId,
      quantity,
      userId,
      sessionId
    );

    sendResponse(res, 200, { item }, "Item added to cart successfully");
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await this.cartService.updateCartItemQuantity(
      itemId,
      quantity
    );

    sendResponse(
      res,
      200,
      { item: updatedItem },
      "Item quantity updated successfully"
    );
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    await this.cartService.removeFromCart(itemId);

    sendResponse(res, 200, {}, "Item removed from cart successfully");
  });

  mergeCarts = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.session.id;
    const userId = req.user?.id;
    await this.cartService.mergeCartsOnLogin(sessionId, userId);

    sendResponse(res, 200, {}, "Carts merged successfully");
  });
}

export default new CartController(new CartService());
