import prisma from "../config/database";

class ShipmentRepository {
  async createShipment(data: {
    orderId: string;
    status: string;
    trackingNumber: string;
    shippedDate: Date;
    deliveryDate: Date;
    carrier: string;
  }) {
    const shipment = await prisma.shipment.create({
      data,
    });
    return shipment;
  }
}

export default ShipmentRepository;
