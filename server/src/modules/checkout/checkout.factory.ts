import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

export const makeCheckoutController = () => {
  const service = new CheckoutService();
  return new CheckoutController(service);
};