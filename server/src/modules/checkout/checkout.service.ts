import stripe from "@/infra/payment/stripe";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

function safeImage(images: string[] = []): string {
  return images?.[0] || PLACEHOLDER_IMAGE;
}

function validImage(url: string): string {
  return url.length <= 2048 ? url : PLACEHOLDER_IMAGE;
}

export class CheckoutService {
  constructor() {}

  async createStripeSession(cart: any, userId: string) {
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
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX", "EG"],
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/orders`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId },
    });

    return session;
  }
}
