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
      const session = event.data.object;
      const { order, payment, shipment, address } =
        await this.webhookService.handleCheckoutCompletion(session);
      console.log("order =>", order);

      console.log("payment =>", payment);
      console.log("shipment =>", shipment);
      console.log("address =>", address);
    }

    sendResponse(res, 200, {}, "Webhook received");
  });
}

export default WebhookController;
