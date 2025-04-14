import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { CheckoutService } from "./checkout.service";
import AppError from "@/shared/errors/AppError";
import { CartService } from "../cart/cart.service";

export class CheckoutController {
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
  });
}
