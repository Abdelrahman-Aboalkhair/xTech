import { ThemeRepository } from './theme.repository';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';

export const makeThemeController = () => {
  const repository = new ThemeRepository();
  const service = new ThemeService(repository);
  return new ThemeController(service);
};