import {
  PrismaClient,
  PAYMENT_STATUS,
  TRANSACTION_STATUS,
  CART_STATUS,
} from "@prisma/client";
import stripe from "@/infra/payment/stripe";
import AppError from "@/shared/errors/AppError";
import redisClient from "@/infra/cache/redis";
import { makeLogsService } from "../logs/logs.factory";

const prisma = new PrismaClient();

export class WebhookService {
  private logsService = makeLogsService();

  private async calculateOrderAmount(cart: any) {
    return cart.cartItems.reduce(
      (sum: number, item: any) =>
        sum +
        item.product.price * (1 - item.product.discount / 100) * item.quantity,
      0
    );
  }

  async handleCheckoutCompletion(session: any) {
    // Preliminary checks
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["customer_details"],
    });

    // ? Make sure the event is not a duplicate. Stripe sends the same event twice due to network retries
    const existingOrder = await prisma.order.findFirst({
      where: { id: fullSession.id },
    });

    if (existingOrder) {
      this.logsService.info("Webhook - Duplicate event ignored", {
        sessionId: session.id,
      });
      return {
        order: existingOrder,
        payment: null,
        transaction: null,
        shipment: null,
        address: null,
      };
    }
    const userId = fullSession?.metadata?.userId;
    if (!userId) {
      throw new AppError(400, "No userId in payment_intent metadata");
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
    if (!cart || cart.cartItems.length === 0) {
      throw new AppError(400, "Cart is empty or not found");
    }

    const amount = await this.calculateOrderAmount(cart);
    if (Math.abs(amount - (fullSession.amount_total ?? 0) / 100) > 0.01) {
      throw new AppError(400, "Amount mismatch between cart and session");
    }

    // Execute atomic operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order and OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          amount,
          orderItems: {
            create: cart.cartItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price * (1 - item.product.discount / 100),
            })),
          },
        },
      });

      // 2. Create Address (if provided)
      let address;
      const customerAddress = fullSession.customer_details?.address;
      if (customerAddress) {
        address = await tx.address.create({
          data: {
            orderId: order.id,
            userId,
            city: customerAddress.city || "N/A",
            state: customerAddress.state || "N/A",
            country: customerAddress.country || "N/A",
            zip: customerAddress.postal_code || "N/A",
            street: customerAddress.line1 || "N/A",
          },
        });
      }

      // 3. Create Payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          userId,
          method: fullSession.payment_method_types?.[0] || "unknown",
          amount,
          status: PAYMENT_STATUS.PAID,
        },
      });

      // 4. Create Transaction
      const transaction = await tx.transaction.create({
        data: {
          orderId: order.id,
          status: TRANSACTION_STATUS.PENDING,
          transactionDate: new Date(),
        },
      });

      // 5. Create Shipment
      const shipment = await tx.shipment.create({
        data: {
          orderId: order.id,
          carrier: "Carrier_" + Math.random().toString(36).substring(2, 10),
          trackingNumber: Math.random().toString(36).substring(2),
          shippedDate: new Date(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // 6. Update Product Stock

      for (const item of cart.cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, salesCount: true },
        });
        if (!product) {
          throw new AppError(404, `Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity)
          throw new AppError(400, "Insufficient stock");

        const newStock = product.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            salesCount: product.salesCount + item.quantity,
          },
        });
      }

      // 7. Clear the Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: CART_STATUS.CONVERTED },
      });

      return { order, payment, transaction, shipment, address };
    });

    // Post-transaction actions (non-atomic)
    await redisClient.del("dashboard:year-range");
    const keys = await redisClient.keys("dashboard:stats:*");
    if (keys.length > 0) await redisClient.del(keys);

    this.logsService.info("Webhook - Order processed successfully", {
      userId,
      orderId: result.order.id,
      amount,
    });

    return result;
  }
}
