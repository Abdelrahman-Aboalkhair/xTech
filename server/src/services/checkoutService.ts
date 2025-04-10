import stripe from "../config/stripe";
import AppError from "../utils/AppError";
import CheckoutRepository from "../repositories/checkoutRepository";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

function safeImage(images: string[] = []): string {
  return images?.[0] || PLACEHOLDER_IMAGE;
}

function validImage(url: string): string {
  return url.length <= 2048 ? url : PLACEHOLDER_IMAGE;
}

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

    const lineItems = cart.cartItems.map((item: any) => {
      const imageUrl = validImage(safeImage(item.product.images));

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: [imageUrl],
          },
          unit_amount: Math.round(
            item.product.price * (1 - item.product.discount / 100) * 100
          ),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      billing_address_collection: "required",
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
