import AppError from "@/shared/errors/AppError";
import axios from "axios";

interface Recommendation {
  id: string;
  title: string;
  category: string;
}

export class RecommendationService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.RECOMMENDER_API_URL || "http://localhost:5000";
  }

  async getRecommendations(
    productId: string,
    numRecommendations: number = 5
  ): Promise<Recommendation[]> {
    try {
      const response = await axios.post(`${this.apiUrl}/recommend`, {
        product_id: productId,
        num_recommendations: numRecommendations,
      });
      return response.data.recommendations;
    } catch (error) {
      throw new AppError(500, "Failed to fetch recommendations");
    }
  }

  async retrainModel() {
    try {
      const response = await axios.post(
        `${this.apiUrl}/retrain`,
        {},
        {
          headers: { "X-API-Key": process.env.RECOMMENDER_API_KEY },
        }
      );
      return response.data;
    } catch (error) {
      throw new AppError(500, "Failed to retrain recommendation model");
    }
  }
}
