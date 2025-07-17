import { gql } from "@apollo/client";

export interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  description: string | null;
  variants: {
    id: string;
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
    barcode: string | null;
    warehouseLocation: string | null;
    attributes: {
      id: string;
      attribute: {
        id: string;
        name: string;
        slug: string;
      };
      value: {
        id: string;
        value: string;
        slug: string;
      };
    }[];
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
  }[];
}

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {
    products(first: $first, skip: $skip, filters: $filters) {
      products {
        id
        name
        slug
        isNew
        isFeatured
        isTrending
        isBestSeller
        averageRating
        reviewCount
        variants {
          id
          sku
          price
          images
          stock
          lowStockThreshold
          barcode
          warehouseLocation
        }
        category {
          id
          name
          slug
        }
        reviews {
          id
          rating
          comment
        }
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      isNew
      isFeatured
      isTrending
      isBestSeller
      averageRating
      reviewCount
      description
      variants {
        id
        sku
        price
        images
        stock
        lowStockThreshold
        barcode
        warehouseLocation
        attributes {
          id
          attribute {
            id
            name
            slug
          }
          value {
            id
            value
            slug
          }
        }
      }
      category {
        id
        name
        slug
      }
      reviews {
        id
        rating
        comment
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      slug
      name
      description
    }
  }
`;
