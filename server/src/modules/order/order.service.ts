import AppError from "../utils/AppError";
import OrderRepository from "../repositories/orderRepository";

class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async getAllOrders() {
    const orders = await this.orderRepository.findAllOrders();
    if (!orders || orders.length === 0) {
      throw new AppError(404, "No orders found");
    }
    return orders;
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderRepository.findOrdersByUserId(userId);
    if (!orders || orders.length === 0) {
      throw new AppError(404, "No orders found for this user");
    }
    return orders;
  }

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
}

export default OrderService;
