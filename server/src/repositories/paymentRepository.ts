import prisma from "../config/database";

class PaymentRepository {
  async findPaymentsByUserId(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findPaymentById(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
    });
  }

  async deletePayment(paymentId: string) {
    return prisma.payment.delete({
      where: { id: paymentId },
    });
  }
}

export default PaymentRepository;
