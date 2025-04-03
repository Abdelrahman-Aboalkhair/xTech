import AppError from "../utils/AppError";
import CheckoutRepository from "../repositories/checkoutRepository";
import WebhookRepository from "../repositories/webhookRepository";
import stripe from "../config/stripe";

class WebhookService {
  constructor(
    private checkoutRepository: CheckoutRepository,
    private webhookRepository: WebhookRepository
  ) {}

  async handleCheckoutCompletion(session: any) {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id);
    console.log("full session: ", fullSession);
    const { userId }: any = fullSession.metadata;
    console.log("session metadata: ", session.metadata);
    if (!userId) throw new AppError(400, "No userId in session metadata");

    const cart = await this.checkoutRepository.findCartByUserId(userId);
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

    await this.checkoutRepository.deleteCartItemsByCartId(cart.id);
    await this.webhookRepository.logWebhookEvent(
      "checkout.session.completed",
      session
    );

    return order;
  }
}

export default WebhookService;
