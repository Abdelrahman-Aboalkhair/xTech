import { v4 as uuidv4 } from "uuid";
import { WebhookRepository } from "./webhook.repository";
import { ShipmentRepository } from "../shipment/shipment.repository";
import { PaymentRepository } from "../payment/payment.repository";
import { OrderRepository } from "../order/order.repository";
import { CartRepository } from "../cart/cart.repository";
import { AddressRepository } from "../address/address.repository";
import { ProductRepository } from "../product/product.repository";
import { TransactionRepository } from "../transaction/transaction.repository"; // New repository for Transaction
import AppError from "@/shared/errors/AppError";
import redisClient from "@/infra/cache/redis";
import stripe from "@/infra/payment/stripe";
import { makeLogsService } from "../logs/logs.factory";

export class WebhookService {
  private logsService = makeLogsService();
  constructor(
    private webhookRepository: WebhookRepository,
    private shipmentRepository: ShipmentRepository,
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private addressRepository: AddressRepository,
    private productRepository: ProductRepository,
    private transactionRepository: TransactionRepository // Added TransactionRepository
  ) {}

  private async calculateOrderAmount(cart: any) {
    return cart.cartItems.reduce(
      (sum: number, item: any) =>
        sum +
        item.product.price * (1 - item.product.discount / 100) * item.quantity,
      0
    );
  }

  private async createCustomerAddress(
    orderId: string,
    session: any,
    userId: string
  ) {
    const customerAddress = session.customer_details?.address;
    if (customerAddress) {
      return this.addressRepository.createAddress({
        orderId,
        userId,
        city: customerAddress.city || "N/A",
        state: customerAddress.state || "N/A",
        country: customerAddress.country || "N/A",
        zip: customerAddress.postal_code || "N/A",
        street: customerAddress.line1 || "N/A",
      });
    }
    return null;
  }

  private generateShipmentData(orderId: string) {
    return {
      carrier: "Carrier_" + uuidv4().slice(0, 8),
      trackingNumber: uuidv4(),
      shippedDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      orderId,
    };
  }

  private async createTransaction(
    orderId: string,
    session: any,
    amount: number
  ) {
    return this.transactionRepository.createTransaction({
      orderId,
      amount,
      status: "PAID", // Align with ORDER_STATUS enum
      paymentMethod: session.payment_method_types?.[0] || "unknown",
      transactionDate: new Date(),
    });
  }

  private async updateProductStock(cart: any) {
    for (let item of cart.cartItems) {
      const product = await this.productRepository.findProductById(
        item.productId
      );
      if (!product) {
        throw new AppError(404, `Product not found: ${item.productId}`);
      }
      const newStock = product.stock - item.quantity;
      if (newStock < 0) {
        throw new AppError(
          400,
          `Not enough stock for product: ${product.name}-${product.id}`
        );
      }
      await this.productRepository.updateProductStock(item.productId, newStock);
      await this.productRepository.incrementSalesCount(
        item.productId,
        item.quantity
      );
    }
  }

  private async clearCartAndInvalidateCache(userId: string, cartId: string) {
    await this.cartRepository.updateCartStatus(cartId, "CONVERTED"); // Update cart status instead of clearing
    await redisClient.del("dashboard:year-range");
    const keys = await redisClient.keys("dashboard:stats:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }

  private async createOrderAndDependencies(
    userId: string,
    session: any,
    cart: any,
    amount: number
  ) {
    const order = await this.orderRepository.createOrder({
      userId,
      amount,
      orderItems: cart.cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price * (1 - item.product.discount / 100),
      })),
      status: "PAID",
    });

    const address = await this.createCustomerAddress(order.id, session, userId);

    const payment = await this.paymentRepository.createPayment({
      orderId: order.id,
      userId,
      method: session.payment_method_types?.[0] || "unknown",
      amount,
      status: "PAID", // Set Payment status
    });

    const transaction = await this.createTransaction(order.id, session, amount);

    const shipmentData = this.generateShipmentData(order.id);
    const shipment = await this.shipmentRepository.createShipment(shipmentData);

    const updatedOrder = await this.orderRepository.findOrderById(order.id);

    return { order: updatedOrder, payment, transaction, shipment, address };
  }

  async handleCheckoutCompletion(session: any) {
    this.logsService.info("Webhook - Checkout completion started", {
      sessionId: session.id,
    });

    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["customer_details"],
    });
    const userId = fullSession?.metadata?.userId;

    if (!userId) {
      await this.logsService.error(
        "Webhook - No userId in payment_intent metadata",
        {
          sessionId: session.id,
        }
      );
      throw new AppError(400, "No userId in payment_intent metadata");
    }

    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart || !cart.cartItems.length) {
      await this.logsService.warn("Webhook - Cart is empty or not found", {
        userId,
        sessionId: session.id,
      });
      throw new AppError(400, "Cart is empty or not found");
    }

    const amount = await this.calculateOrderAmount(cart);

    if (Math.abs(amount - fullSession.amount_total / 100) > 0.01) {
      await this.logsService.error(
        "Webhook - Amount mismatch between cart and session",
        {
          userId,
          sessionId: session.id,
          cartAmount: amount,
          sessionAmount: fullSession.amount_total / 100,
        }
      );
      throw new AppError(400, "Amount mismatch between cart and session");
    }

    const { order, payment, transaction, shipment, address } =
      await this.createOrderAndDependencies(userId, fullSession, cart, amount);

    this.logsService.info("Webhook - Order and dependencies created", {
      userId,
      orderId: order?.id,
      paymentId: payment.id,
      transactionId: transaction.id,
      shipmentId: shipment.id,
      addressId: address?.id,
      amount,
    });

    await this.updateProductStock(cart);
    this.logsService.debug("Webhook - Product stock updated", { userId });

    await this.clearCartAndInvalidateCache(userId, cart.id);
    this.logsService.debug(
      "Webhook - Cart status updated and cache invalidated",
      {
        userId,
        cartId: cart.id,
      }
    );

    await this.webhookRepository.logWebhookEvent(
      "checkout.session.completed",
      fullSession
    );
    this.logsService.info("Webhook - checkout.session.completed logged in DB", {
      userId,
      sessionId: session.id,
    });

    return { order, payment, transaction, shipment, address: address || null };
  }
}
