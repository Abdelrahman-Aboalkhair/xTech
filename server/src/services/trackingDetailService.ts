// services/trackingService.ts
import TrackingDetailRepository from "repositories/trackingDetailRepository";
import AppError from "../utils/AppError";

class TrackingDetailService {
  constructor(private trackingDetailRepository: TrackingDetailRepository) {}

  // Get all tracking details for an authenticated user
  async getUserTracking(userId: string) {
    const tracking = await this.trackingDetailRepository.findTrackingByUserId(
      userId
    );
    if (!tracking || tracking.length === 0) {
      throw new AppError(404, "No tracking details found for this user");
    }
    return tracking;
  }

  // Get all tracking details (admin only)
  async getAllTracking() {
    const tracking = await this.trackingDetailRepository.findAllTracking();
    if (!tracking || tracking.length === 0) {
      throw new AppError(404, "No tracking details found");
    }
    return tracking;
  }

  // Delete a tracking record (admin only)
  async deleteTracking(trackingId: string) {
    const deletedTracking =
      await this.trackingDetailRepository.deleteTrackingById(trackingId);
    if (!deletedTracking) {
      throw new AppError(404, "Tracking not found");
    }
    return deletedTracking;
  }
}

export default TrackingDetailService;
