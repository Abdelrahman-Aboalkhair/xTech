import prisma from "../config/database";

class WebhookRepository {
  async logWebhookEvent(eventType: string, eventData: any) {
    return prisma.webhookLog.create({
      data: {
        eventType,
        payload: eventData,
      },
    });
  }
}

export default WebhookRepository;
