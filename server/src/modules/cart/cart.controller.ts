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
    console.log("getOrCreateCart result => ", cart);

    sendResponse(res, 200, {
      data: { cart },
      message: "Cart fetched successfully",
    });

    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Cart fetched", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
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
    console.log("userId addToCart => ", userId);
    const sessionId = req.session.id;
    console.log("sessionId addToCart => ", sessionId);
    const { productId, quantity } = req.body;

    const item = await this.cartService.addToCart(
      productId,
      quantity,
      userId,
      sessionId
    );

    console.log("item from addToCart => ", item);

    sendResponse(res, 200, {
      data: { item },
      message: "Item added to cart successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Item added to cart", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
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
      data: { item: { updatedItem } },
      message: "Item quantity updated successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Item quantity updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    await this.cartService.removeFromCart(itemId);

    sendResponse(res, 200, { message: "Item removed from cart successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Item removed from cart", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  mergeCarts = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.session.id;
    const userId = req.user?.id;
    await this.cartService.mergeCartsOnLogin(sessionId, userId);

    sendResponse(res, 200, { message: "Carts merged successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Carts merged", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
