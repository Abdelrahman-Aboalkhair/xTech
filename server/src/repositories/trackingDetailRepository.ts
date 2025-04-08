// repositories/trackingRepository.ts
import prisma from "../config/database";

class TrackingDetailRepository {
  // Get all tracking details
  async findAllTracking() {
    return prisma.trackingDetail.findMany({
      include: {
        order: {
          include: {
            orderItems: { include: { product: true } },
          },
        },
      },
    });
  }

  // Get tracking details for a specific user (assumed relationship between user and orders)
  async findTrackingByUserId(userId: string) {
    return prisma.trackingDetail.findMany({
      where: {
        order: {
          userId: userId,
        },
      },
      include: {
        order: {
          include: {
            orderItems: { include: { product: true } },
          },
        },
      },
    });
  }

  // Delete a tracking record by ID
  async deleteTrackingById(trackingId: string) {
    return prisma.trackingDetail.delete({
      where: {
        id: trackingId,
      },
    });
  }
}

export default TrackingDetailRepository;
