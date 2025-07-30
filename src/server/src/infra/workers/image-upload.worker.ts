import { Job } from "bullmq";
import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/cloudinary";

interface ImageUploadJobData {
    productId: string;
    files: Array<{
        path: string;
        originalname: string;
    }>;
}

@injectable()
export class ImageUploadWorker {
    constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

    async process(job: Job<ImageUploadJobData>): Promise<void> {
        const { productId, files } = job.data;

        try {
            const uploadedImages = await uploadToCloudinary(files);
            const imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);

            await this.prisma.product.update({
                where: { id: productId },
                data: { images: imageUrls },
            });

            console.log(`Images uploaded for product ${productId}`);
        } catch (error) {
            console.error(`Failed to upload images for product ${productId}:`, error);
            throw error;
        }
    }
}