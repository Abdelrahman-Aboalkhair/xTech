import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int, $skip: Int, $filters: ProductFilters) {
    products(first: $first, skip: $skip, filters: $filters) {
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
        category {
          id
          name
          slug
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

export const GET_NEW_PRODUCTS = gql`
  query GetNewProducts($first: Int, $skip: Int) {
    newProducts(first: $first, skip: $skip) {
      products {
        id
        slug
        name
        price
        discount
        stock
        images
        isNew
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int, $skip: Int) {
    featuredProducts(first: $first, skip: $skip) {
      products {
        id
        slug
        name
        price
        discount
        stock
        images
        isFeatured
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_TRENDING_PRODUCTS = gql`
  query GetTrendingProducts($first: Int, $skip: Int) {
    trendingProducts(first: $first, skip: $skip) {
      products {
        id
        slug
        name
        price
        discount
        stock
        images
        isTrending
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_BEST_SELLER_PRODUCTS = gql`
  query GetBestSellerProducts($first: Int, $skip: Int) {
    bestSellerProducts(first: $first, skip: $skip) {
      products {
        id
        slug
        name
        price
        discount
        stock
        images
        isBestSeller
      }
      hasMore
      totalCount
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
