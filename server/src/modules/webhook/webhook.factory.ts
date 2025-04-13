import { WebhookRepository } from './webhook.repository';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

export const makeWebhookController = () => {
  const repository = new WebhookRepository();
  const service = new WebhookService(repository);
  return new WebhookController(service);
};