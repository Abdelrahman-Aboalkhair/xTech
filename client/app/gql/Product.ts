import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      slug
      name
      price
      discount
      stock
      images
      isNew
      isFeatured
      isTrending
      isBestSeller
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($slug: String!) {
    product(slug: $slug) {
      id
      slug
      name
      price
      discount
      stock
      images
      isNew
      isFeatured
      isTrending
      isBestSeller
      reviews {
        id
        rating
        comment
      }
    }
  }
`;

export const GET_NEW_PRODUCTS = gql`
  query GetNewProducts {
    newProducts {
      id
      slug
      name
      price
      discount
      stock
      images
      isNew
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    featuredProducts {
      id
      slug
      name
      price
      discount
      stock
      images
      isFeatured
    }
  }
`;

export const GET_TRENDING_PRODUCTS = gql`
  query GetTrendingProducts {
    trendingProducts {
      id
      slug
      name
      price
      discount
      stock
      images
      isTrending
    }
  }
`;

export const GET_BEST_SELLER_PRODUCTS = gql`
  query GetBestSellerProducts {
    bestSellerProducts {
      id
      slug
      name
      price
      discount
      stock
      images
      isBestSeller
    }
  }
`;
