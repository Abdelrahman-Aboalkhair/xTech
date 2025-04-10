import AppError from "../utils/AppError";
import WebhookRepository from "../repositories/webhookRepository";
import stripe from "../config/stripe";
import CartRepository from "../repositories/cartRepository";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis";
import ProductRepository from "../repositories/productRepository";
import ShipmentRepository from "../repositories/shipmentRepository";
import OrderRepository from "../repositories/orderRepository";
import AddressRepository from "../repositories/addressRepository";
import PaymentRepository from "../repositories/paymentRepository";

class WebhookService {
  constructor(
    private webhookRepository: WebhookRepository,
    private shipmentRepository: ShipmentRepository,
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private addressRepository: AddressRepository,
    private productRepository: ProductRepository
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
        orderId: orderId,
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
  private async updateProductStock(cart: any) {
    for (let item of cart.cartItems) {
      const product = await this.productRepository.findProductById(
        item.productId
      );
      if (product) {
        const newStock = product.stock - item.quantity;
        if (newStock < 0) {
          throw new AppError(
            400,
            `Not enough stock for product: ${product.name}-${product.id}`
          );
        }
        await this.productRepository.updateProductStock(
          item.productId,
          newStock
        );
      }
    }
  }

  private async clearCartAndInvalidateCache(userId: string) {
    console.log("userId being passed to clearCartAndInvalidateCache: ", userId);
    await this.cartRepository.clearCart(userId);

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
    console.log("cart: ", cart);

    const order = await this.orderRepository.createOrder({
      userId,
      amount,
      orderItems: cart.cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: "PAID",
    });

    const address = await this.createCustomerAddress(order.id, session, userId);

    const payment = await this.paymentRepository.createPayment({
      orderId: order.id,
      userId,
      method: session.payment_method_types?.[0] || "unknown",
      amount,
    });

    const shipmentData = this.generateShipmentData(order.id);
    const shipment = await this.shipmentRepository.createShipment(shipmentData);

    const updatedOrder = await this.orderRepository.findOrderById(order.id);

    return { order: updatedOrder, payment, shipment, address };
  }

  async handleCheckoutCompletion(session: any) {
    console.log("session: ", session);
    const fullSession = await stripe.checkout.sessions.retrieve(session.id);
    const userId = fullSession?.metadata?.userId;

    if (!userId) {
      throw new AppError(400, "No userId in payment_intent metadata");
    }

    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart || !cart.cartItems.length) {
      throw new AppError(400, "Cart is empty or not found");
    }

    const amount = await this.calculateOrderAmount(cart);

    const { order, payment, shipment, address } =
      await this.createOrderAndDependencies(userId, fullSession, cart, amount);

    await this.updateProductStock(cart);
    await this.clearCartAndInvalidateCache(userId);

    await this.webhookRepository.logWebhookEvent(
      "checkout.session.completed",
      session
    );

    return { order, payment, shipment, address: address || null };
  }
}

export default WebhookService;
