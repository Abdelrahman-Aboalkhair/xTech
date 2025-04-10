import express from "express";
import optionalAuth from "../middlewares/optionalAuth";
import shipmentController from "../controllers/shipmentController";

const router = express.Router();

router.post("/", optionalAuth, shipmentController.createShipment);

export default router;
