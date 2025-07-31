export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  slug: string;
  images: string[];
  category?: Category | null;
  categoryId?: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  products: Product[];
}
