import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { CheckoutService } from "./checkout.service";
import AppError from "@/shared/errors/AppError";
import { CartService } from "../cart/cart.service";
import { makeLogsService } from "../logs/logs.factory";

export class CheckoutController {
  private logsService = makeLogsService();

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService
  ) {}

  initiateCheckout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(400, "User not found");
    }

    const cart = await this.cartService.getOrCreateCart(userId);
    const session = await this.checkoutService.createStripeSession(
      cart,
      userId
    );
    sendResponse(res, 200, {
      data: { sessionId: session.id },
      message: "Checkout initiated successfully",
    });
    const start = Date.now();
    const end = Date.now();

    this.cartService.logCartEvent(cart.id, "CHECKOUT_STARTED", userId);

    this.logsService.info("Checkout initiated", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}
