import AppError from "../utils/AppError";
import OrderRepository from "../repositories/orderRepository";

class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  // Get all orders for the authenticated user
  async getUserOrders(userId: string) {
    const orders = await this.orderRepository.findOrdersByUserId(userId);
    if (!orders || orders.length === 0) {
      throw new AppError(404, "No orders found for this user");
    }
    return orders;
  }

  // Get details of a specific order
  async getOrderDetails(orderId: string, userId: string) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    if (order.userId !== userId) {
      throw new AppError(403, "You are not authorized to view this order");
    }
    return order;
  }

  // Update tracking status (admin only)
  async updateTrackingStatus(
    orderId: string,
    status: string,
    userRole: string
  ) {
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      throw new AppError(403, "Only admins can update tracking status");
    }
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    return this.orderRepository.upsertTrackingDetail(orderId, status);
  }
}

export default OrderService;
