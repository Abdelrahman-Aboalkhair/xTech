import { PageRepository } from './page.repository';
import { PageService } from './page.service';
import { PageController } from './page.controller';

export const makePageController = () => {
  const repository = new PageRepository();
  const service = new PageService(repository);
  return new PageController(service);
};