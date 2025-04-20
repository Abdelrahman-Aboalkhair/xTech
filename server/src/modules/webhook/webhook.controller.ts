import stripe from "@/infra/payment/stripe";
import AppError from "@/shared/errors/AppError";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { Request, Response } from "express";
import { WebhookService } from "./webhook.service";
import { makeLogsService } from "../logs/logs.factory";

export class WebhookController {
  private logsService = makeLogsService();
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

    sendResponse(res, 200, { message: "Webhook received successfully" });

    // const start = Date.now();
    // const end = Date.now();

    // this.logsService.info("Webhook received", {
    //   userId: req.user?.id,
    //   sessionId: req.session.id,
    //   timePeriod: end - start,
    // });
  });
}
