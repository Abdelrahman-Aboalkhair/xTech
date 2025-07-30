export interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  images: File[] | string[]; // File[] for uploads, string[] for existing URLs
  video?: File | string; // File for upload, string for existing videoUrl
}
