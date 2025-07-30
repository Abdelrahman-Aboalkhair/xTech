import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (
  files: Express.Multer.File[],
  resourceType: "image" | "video" = "image"
) => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: `ecommerce/${resourceType}s`,
      })
    );
    const results = await Promise.all(uploadPromises);
    return results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
};
