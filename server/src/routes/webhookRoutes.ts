import express from "express";
import WebhookController from "../controllers/webhookController";
import WebhookService from "../services/webhookService";
import CheckoutRepository from "../repositories/checkoutRepository";
import WebhookRepository from "../repositories/webhookRepository";
import CartRepository from "../repositories/cartRepository";
import bodyParser from "body-parser";
import ProductRepository from "../repositories/productRepository";

const router = express.Router();
const checkoutRepository = new CheckoutRepository();
const webhookRepository = new WebhookRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const webhookService = new WebhookService(
  checkoutRepository,
  webhookRepository,
  cartRepository,
  productRepository
);
const webhookController = new WebhookController(webhookService);

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  webhookController.handleWebhook
);

export default router;
