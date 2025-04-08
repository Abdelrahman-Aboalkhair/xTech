// routes/trackingRoutes.ts
import express from "express";
import TrackingController from "../controllers/trackingController";
import protect from "../middlewares/protect";
import TrackingDetailRepository from "../repositories/trackingDetailRepository";
import TrackingDetailService from "../services/trackingDetailService";

const router = express.Router();
const trackingRepository = new TrackingDetailRepository();
const trackingService = new TrackingDetailService(trackingRepository);
const trackingController = new TrackingController(trackingService);

// Get all tracking details for the authenticated user
router.get("/", protect, trackingController.getUserTracking);

// Get all tracking details (admin only)
router.get("/all", protect, trackingController.getAllTracking);

// Delete a tracking record (admin only)
router.delete("/:trackingId", protect, trackingController.deleteTracking);

export default router;
