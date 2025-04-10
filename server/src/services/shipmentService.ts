import ShipmentRepository from "../repositories/shipmentRepository";
import AppError from "../utils/AppError";

class ShipmentService {
  private shipmentRepository: ShipmentRepository;

  constructor() {
    this.shipmentRepository = new ShipmentRepository();
  }

  async createShipment(data: {
    orderId: string;
    status: string;
    trackingNumber: string;
    shippedDate: Date;
    deliveryDate: Date;
    carrier: string;
  }) {
    const shipment = await this.shipmentRepository.createShipment(data);
    return shipment;
  }
}

export default ShipmentService;
