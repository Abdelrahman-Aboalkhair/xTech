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

  async updateModel(product: {
    id: string;
    title: string;
    description?: string;
    category?: string;
  }) {
    try {
      await axios.post(`${this.apiUrl}/update`, product);
    } catch (error) {
      console.error("Failed to update recommender model:", error);
    }
  }
}
