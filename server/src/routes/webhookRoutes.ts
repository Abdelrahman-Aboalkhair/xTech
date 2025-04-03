import express from "express";
import WebhookController from "../controllers/webhookController";
import WebhookService from "../services/webhookService";
import CheckoutRepository from "../repositories/checkoutRepository";
import WebhookRepository from "../repositories/webhookRepository";

const router = express.Router();
const checkoutRepository = new CheckoutRepository();
const webhookRepository = new WebhookRepository();
const webhookService = new WebhookService(
  checkoutRepository,
  webhookRepository
);
const webhookController = new WebhookController(webhookService);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  webhookController.handleWebhook
);

export default router;
