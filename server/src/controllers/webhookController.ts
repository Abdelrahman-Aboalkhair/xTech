import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import stripe from "../config/stripe";
import WebhookService from "../services/webhookService";

class WebhookController {
  constructor(private webhookService: WebhookService) {}

  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    console.log("received webhook: ", req.body);
    const sig = req.headers["stripe-signature"];
    if (!sig) throw new AppError(400, "No Stripe signature");

    let event;

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Parsed Event:", event.type);

    if (event.type === "checkout.session.completed") {
      console.log("Checkout Session Completed Event:", event.data.object);
      const session = event.data.object;
      console.log("session: ", session);
      const order = await this.webhookService.handleCheckoutCompletion(session);
      console.log("Order created:", order);
    }

    sendResponse(res, 200, {}, "Webhook received");
  });
}

export default WebhookController;
