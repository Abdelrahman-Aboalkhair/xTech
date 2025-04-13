import AppError from "../utils/AppError";
import BannerRepository from "../repositories/bannerRepository";

class BannerService {
  private bannerRepository: BannerRepository;

  constructor() {
    this.bannerRepository = new BannerRepository();
  }

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

export default BannerService;
