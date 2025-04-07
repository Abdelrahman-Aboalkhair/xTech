import stripe from "../config/stripe";
import AppError from "../utils/AppError";
import CheckoutRepository from "../repositories/checkoutRepository";

class CheckoutService {
  constructor(private checkoutRepository: CheckoutRepository) {}

  async getCartForCheckout(userId: string) {
    console.log("userId: ", userId);
    const cart = await this.checkoutRepository.findCartByUserId(userId);
    console.log("Found cart: ", cart);
    if (!cart || !cart.cartItems.length) {
      throw new AppError(400, "Cart is empty or not found");
    }
    return cart;
  }

  async createStripeSession(cart: any, userId: string) {
    console.log("received userId to pass to the session: ", userId);
    const lineItems = cart.cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.images,
        },
        unit_amount: Math.round(
          item.product.price * (1 - item.product.discount / 100) * 100
        ),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId },
    });

    console.log("created session: ", session);

    return session;
  }
}

export default CheckoutService;
