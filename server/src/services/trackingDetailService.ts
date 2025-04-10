import TrackingDetailRepository from "../repositories/trackingDetailRepository";
import AppError from "../utils/AppError";

class TrackingDetailService {
  constructor(private trackingDetailRepository: TrackingDetailRepository) {}

  async getUserTracking(userId: string) {
    const tracking = await this.trackingDetailRepository.findTrackingByUserId(
      userId
    );
    if (!tracking || tracking.length === 0) {
      throw new AppError(404, "No tracking details found for this user");
    }
    return tracking;
  }

  async getAllTracking() {
    const tracking = await this.trackingDetailRepository.findAllTracking();
    if (!tracking || tracking.length === 0) {
      throw new AppError(404, "No tracking details found");
    }
    return tracking;
  }

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
