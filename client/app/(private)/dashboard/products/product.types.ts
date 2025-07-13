export interface ProductFormData {
  id?: string;
  name: string;
  description?: string;
  categoryId: string;
  isNew: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  images: (File | string)[];
  variants: {
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold?: number;
    barcode?: string;
    warehouseLocation?: string;
    attributes: { attributeId: string; valueId: string }[];
  }[];
}