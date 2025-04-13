import AppError from "../utils/AppError";
import PaymentRepository from "../repositories/paymentRepository";

class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  // Get all payments for the authenticated user
  async getUserPayments(userId: string) {
    const payments = await this.paymentRepository.findPaymentsByUserId(userId);
    if (!payments || payments.length === 0) {
      throw new AppError(404, "No payments found for this user");
    }
    return payments;
  }

  // Get details of a specific payment
  async getPaymentDetails(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError(404, "Payment not found");
    }
    if (payment.userId !== userId) {
      throw new AppError(403, "You are not authorized to view this payment");
    }
    return payment;
  }

  // Delete a payment (admin only)
  async deletePayment(paymentId: string) {
    const payment = await this.paymentRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError(404, "Payment not found");
    }
    return this.paymentRepository.deletePayment(paymentId);
  }
}

export default PaymentService;
