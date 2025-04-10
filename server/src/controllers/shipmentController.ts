import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import ShipmentService from "../services/shipmentService";

class ShipmentController {
  private shipmentService: ShipmentService;

  constructor(shipmentService: ShipmentService) {
    this.shipmentService = shipmentService;
  }

  createShipment = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const shipment = await this.shipmentService.createShipment(data);
      sendResponse(res, 201, { shipment }, "Shipment created successfully");
    }
  );
}

export default new ShipmentController(new ShipmentService());
