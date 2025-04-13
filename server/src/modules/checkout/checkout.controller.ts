import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CheckoutService from "../services/checkoutService";
import AppError from "../utils/AppError";
import CartService from "../services/cartService";

class CheckoutController {
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
    sendResponse(
      res,
      200,
      { sessionId: session.id },
      "Checkout session created"
    );
  });
}

export default new CheckoutController(new CheckoutService(), new CartService());
