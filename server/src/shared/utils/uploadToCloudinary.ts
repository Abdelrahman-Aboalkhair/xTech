import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    console.log("Error upload file to cloudinary");
  }
};
