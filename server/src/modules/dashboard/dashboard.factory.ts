import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

export const makeDashboardController = () => {
  const repository = new DashboardRepository();
  const service = new DashboardService(repository);
  return new DashboardController(service);
};