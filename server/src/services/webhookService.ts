import AppError from "../utils/AppError";
import CheckoutRepository from "../repositories/checkoutRepository";
import WebhookRepository from "../repositories/webhookRepository";
import stripe from "../config/stripe";
import CartRepository from "../repositories/cartRepository";

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

    const order = await this.checkoutRepository.createOrder({
      userId,
      amount,
      orderItems: cart.cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    await this.cartRepository.clearCart(userId);
    await this.webhookRepository.logWebhookEvent(
      "checkout.session.completed",
      session
    );

    return order;
  }
}

export default WebhookService;
