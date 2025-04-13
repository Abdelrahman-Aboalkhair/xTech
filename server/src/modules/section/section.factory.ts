import { SectionRepository } from './section.repository';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

export const makeSectionController = () => {
  const repository = new SectionRepository();
  const service = new SectionService(repository);
  return new SectionController(service);
};