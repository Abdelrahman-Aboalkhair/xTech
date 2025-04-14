import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ShipmentService } from "./shipment.service";

export class ShipmentController {
  constructor(private shipmentService: ShipmentService) {}

  createShipment = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const shipment = await this.shipmentService.createShipment(data);
      sendResponse(res, 201, {
        data: shipment,
        message: "Shipment created successfully",
      });
    }
  );
}
