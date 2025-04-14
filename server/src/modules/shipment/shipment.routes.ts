import express from "express";
import { makeShipmentController } from "./shipment.factory";
import optionalAuth from "@/shared/middlewares/optionalAuth";

const router = express.Router();
const shipmentController = makeShipmentController();

router.post("/", optionalAuth, shipmentController.createShipment);

export default router;
