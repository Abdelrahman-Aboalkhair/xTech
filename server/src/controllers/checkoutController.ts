import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CheckoutService from "../services/checkoutService";
import AppError from "../utils/AppError";

class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  initiateCheckout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const cart = await this.checkoutService.getCartForCheckout(userId);
    console.log("Found cart for checkout: ", cart);
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

export default CheckoutController;
