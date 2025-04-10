import express from "express";
import WebhookController from "../controllers/webhookController";
import WebhookService from "../services/webhookService";
import WebhookRepository from "../repositories/webhookRepository";
import CartRepository from "../repositories/cartRepository";
import bodyParser from "body-parser";
import ProductRepository from "../repositories/productRepository";
import OrderRepository from "../repositories/orderRepository";
import PaymentRepository from "../repositories/paymentRepository";
import AddressRepository from "../repositories/addressRepository";
import ShipmentRepository from "../repositories/shipmentRepository";

const router = express.Router();
const webhookRepository = new WebhookRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const paymentRepository = new PaymentRepository();
const addressRepository = new AddressRepository();
const shipmentRepository = new ShipmentRepository();
const webhookService = new WebhookService(
  webhookRepository,
  shipmentRepository,
  paymentRepository,
  orderRepository,
  cartRepository,
  addressRepository,
  productRepository
);
const webhookController = new WebhookController(webhookService);

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  webhookController.handleWebhook
);

export default router;
