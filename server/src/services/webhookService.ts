import AppError from "../utils/AppError";
import CheckoutRepository from "../repositories/checkoutRepository";
import WebhookRepository from "../repositories/webhookRepository";
import stripe from "../config/stripe";
import CartRepository from "../repositories/cartRepository";
import redisClient from "../config/redis";

class WebhookService {
  constructor(
    private checkoutRepository: CheckoutRepository,
    private webhookRepository: WebhookRepository,
    private cartRepository: CartRepository
  ) {}

  async handleCheckoutCompletion(session: any) {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id);
    console.log("full session: ", fullSession);
    const userId = fullSession?.metadata?.userId;

    if (!userId) {
      throw new AppError(400, "No userId in payment_intent metadata");
    }
    console.log("session metadata: ", session.metadata);

    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart || !cart.cartItems.length) {
      throw new AppError(400, "Cart is empty or not found");
    }

    const amount = cart.cartItems.reduce(
      (sum: number, item: any) =>
        sum +
        item.product.price * (1 - item.product.discount / 100) * item.quantity,
      0
    );

    const payment = await this.checkoutRepository.createPayment({
      userId,
      method: fullSession.payment_method_types[0],
      amount,
    });

    let address;
    const customerAddress = fullSession.customer_details?.address;
    if (customerAddress) {
      address = await this.checkoutRepository.createAddress({
        userId,
        city: customerAddress.city || "N/A",
        state: customerAddress.state || "N/A",
        country: customerAddress.country || "N/A",
        zip: customerAddress.postal_code || "N/A",
        street: customerAddress.line1 || "N/A",
      });
    }

    const order = await this.checkoutRepository.createOrder({
      userId,
      amount,
      orderItems: cart.cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    const tracking = await this.checkoutRepository.createTrackingDetail({
      orderId: order.id,
    });

    await this.cartRepository.clearCart(userId);
    await this.webhookRepository.logWebhookEvent(
      "checkout.session.completed",
      session
    );

    await redisClient.del("dashboard:year-range"); // Invalidate year range cache
    const keys = await redisClient.keys("dashboard:stats:*"); // Invalidate all stats caches
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    return { order, payment, tracking, address: address || null };
  }
}

export default WebhookService;
