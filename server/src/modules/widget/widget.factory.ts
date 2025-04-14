import { WidgetRepository } from "./widget.repository";
import { WidgetService } from "./widget.service";
import { WidgetController } from "./widget.controller";

export const makeWidgetController = () => {
  const repository = new WidgetRepository();
  const service = new WidgetService(repository);
  return new WidgetController(service);
};
