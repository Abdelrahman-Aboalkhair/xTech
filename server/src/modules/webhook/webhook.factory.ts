import { WebhookRepository } from "./webhook.repository";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { ProductRepository } from "../product/product.repository";
import { ProductService } from "../product/product.service";
import { ShipmentRepository } from "../shipment/shipment.repository";
import { ShipmentService } from "../shipment/shipment.service";
import { PaymentRepository } from "../payment/payment.repository";
import { OrderRepository } from "../order/order.repository";
import { AddressRepository } from "../address/address.repository";
import { CartRepository } from "../cart/cart.repository";

export const makeWebhookController = () => {
  const productRepo = new ProductRepository();
  const shipmentRepo = new ShipmentRepository();
  const paymentRepo = new PaymentRepository();
  const orderRepo = new OrderRepository();
  const addressRepo = new AddressRepository();
  const cartRepo = new CartRepository();

  const webhookRepo = new WebhookRepository();
  const webhookService = new WebhookService(
    webhookRepo,
    shipmentRepo,
    paymentRepo,
    orderRepo,
    cartRepo,
    addressRepo,
    productRepo
  );
  return new WebhookController(webhookService);
};
