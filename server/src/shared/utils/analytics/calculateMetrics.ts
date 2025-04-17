export const calculateMetrics = (
  orders: any[],
  orderItems: any[],
  users: any[]
) => ({
  totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
  totalOrders: orders.length,
  totalSales: orderItems.reduce((sum, item) => sum + item.quantity, 0),
  totalUsers: users.length,
  averageOrderValue:
    orders.length > 0
      ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length
      : 0,
});
