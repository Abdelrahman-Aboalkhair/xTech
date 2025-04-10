import prisma from "../config/database";

class TrackingDetailRepository {
  async createTrackingDetail(data: { orderId: string; status: string }) {
    return prisma.trackingDetail.create({
      data: {
        status: data.status,
        orderId: data.orderId,
      },
    });
  }
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

  async deleteTrackingById(trackingId: string) {
    return prisma.trackingDetail.delete({
      where: {
        id: trackingId,
      },
    });
  }
}

export default TrackingDetailRepository;
