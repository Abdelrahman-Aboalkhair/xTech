import { BannerRepository } from './banner.repository';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

export const makeBannerController = () => {
  const repository = new BannerRepository();
  const service = new BannerService(repository);
  return new BannerController(service);
};