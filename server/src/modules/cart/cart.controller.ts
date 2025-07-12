import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { CartService } from "./cart.service";
import { makeLogsService } from "../logs/logs.factory";

export class CartController {
  private logsService = makeLogsService();
  constructor(private cartService: CartService) {}

  getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.session.id;

    const cart = await this.cartService.getOrCreateCart(userId, sessionId);
    sendResponse(res, 200, {
      data: { cart },
      message: "Cart fetched successfully",
    });

    this.logsService.info("Cart fetched", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now(),
    });
  });

  getCartCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.session.id;

    const cartCount = await this.cartService.getCartCount(userId, sessionId);
    sendResponse(res, 200, {
      data: { cartCount },
      message: "Cart count fetched successfully",
    });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.session.id;
    const { variantId, quantity } = req.body;

    const item = await this.cartService.addToCart(
      variantId,
      quantity,
      userId,
      sessionId
    );

    sendResponse(res, 200, {
      data: { item },
      message: "Item added to cart successfully",
    });

    this.logsService.info("Item added to cart", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now(),
    });
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await this.cartService.updateCartItemQuantity(
      itemId,
      quantity
    );

    sendResponse(res, 200, {
      data: { item: updatedItem },
      message: "Item quantity updated successfully",
    });

    this.logsService.info("Item quantity updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now(),
    });
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    await this.cartService.removeFromCart(itemId);

    sendResponse(res, 200, { message: "Item removed from cart successfully" });

    this.logsService.info("Item removed from cart", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now(),
    });
  });

  mergeCarts = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.session.id;
    const userId = req.user?.id;
    await this.cartService.mergeCartsOnLogin(sessionId, userId);

    sendResponse(res, 200, { message: "Carts merged successfully" });

    this.logsService.info("Carts merged", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now(),
    });
  });
}