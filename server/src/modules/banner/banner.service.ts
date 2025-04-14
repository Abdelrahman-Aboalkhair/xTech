import AppError from "@/shared/errors/AppError";
import { BannerRepository } from "./banner.repository";

export class BannerService {
  constructor(private bannerRepository: BannerRepository) {}

  async createBanner(data: any) {
    return this.bannerRepository.create(data);
  }

  async getAllBanners() {
    return this.bannerRepository.findAll();
  }

  async getBannerById(id: number) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new AppError(404, "Banner not found");
    return banner;
  }

  async updateBanner(id: number, data: any) {
    return this.bannerRepository.update(id, data);
  }

  async deleteBanner(id: number) {
    return this.bannerRepository.delete(id);
  }
}
