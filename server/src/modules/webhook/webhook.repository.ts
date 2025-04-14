import prisma from "@/infra/database/database.config";

export class WebhookRepository {
  async logWebhookEvent(eventType: string, eventData: any) {
    return prisma.webhookLog.create({
      data: {
        eventType,
        payload: eventData,
      },
    });
  }
}
