import { Context } from "../resolver";

const abandonedCartAnalytics = {
  Query: {
    abandonedCartAnalytics: async (
      parent: any,
      args: { startDate: string; endDate: string },
      context: Context
    ) => {
      const { startDate, endDate } = args;
      const { prisma } = context;

      // Validate date range
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
      }

      if (start > end) {
        throw new Error("Start date must be before end date");
      }

      // Fetch cart events
      const cartEvents = await prisma.cartEvent.findMany({
        where: {
          timestamp: {
            gte: start,
            lte: end,
          },
        },
        include: {
          cart: {
            include: { cartItems: true },
          },
          user: true,
        },
      });

      // Group events by cartId
      const cartEventsByCartId = cartEvents.reduce((acc: any, event) => {
        if (!acc[event.cartId]) acc[event.cartId] = [];
        acc[event.cartId].push(event); // { cartId: [events] }
        return acc;
      }, {});

      let totalCarts = 0;
      let totalAbandonedCarts = 0;
      let potentialRevenueLost = 0;

      for (const cartId in cartEventsByCartId) {
        const events = cartEventsByCartId[cartId];
        const hasAddToCart = events.some((e: any) => e.eventType === "ADD");
        const hasCheckoutCompleted = events.some(
          (e: any) => e.eventType === "CHECKOUT_COMPLETED"
        );

        // Only count carts that have items
        const cart = events[0].cart;
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) continue;

        totalCarts++;

        // Check if cart is abandoned (has ADD but no CHECKOUT_COMPLETED events within 1 hour)
        if (hasAddToCart && !hasCheckoutCompleted) {
          const addToCartEvent = events.find((e: any) => e.eventType === "ADD");
          const oneHourLater = new Date(
            addToCartEvent.timestamp.getTime() + 60 * 60 * 1000 // 1 hour
          );
          const now = new Date();

          // If now is after 1 hour later, cart is abandoned
          if (now > oneHourLater) {
            totalAbandonedCarts++;
            // Calculate potential revenue lost
            potentialRevenueLost += cart.cartItems.reduce(
              (sum: number, item: any) => sum + item.quantity * item.price,
              0
            );
          }
        }
      }

      const abandonmentRate =
        totalCarts > 0 ? (totalAbandonedCarts / totalCarts) * 100 : 0;

      return {
        totalAbandonedCarts,
        abandonmentRate,
        potentialRevenueLost,
      };
    },
  },
};

export default abandonedCartAnalytics;
