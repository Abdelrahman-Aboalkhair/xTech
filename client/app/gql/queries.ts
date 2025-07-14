import { gql } from "@apollo/client";

const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    slug
    name
    description
    images
    salesCount
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
      stock
      lowStockThreshold
      barcode
      warehouseLocation
    }
    category {
      id
      slug
      name
      description
    }
    reviews {
      id
      rating
      comment
    }
  }
`;

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData($first: Int, $skip: Int) {
    featuredProducts(first: $first, skip: $skip) {
      products {
        ...ProductFragment
      }
      hasMore
      totalCount
    }
    newProducts(first: $first, skip: $skip) {
      products {
        ...ProductFragment
      }
      hasMore
      totalCount
    }
    trendingProducts(first: $first, skip: $skip) {
      products {
        ...ProductFragment
      }
      hasMore
      totalCount
    }
    bestSellerProducts(first: $first, skip: $skip) {
      products {
        ...ProductFragment
      }
      hasMore
      totalCount
    }
  }
  ${ProductFragment}
`;

export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($slug: String!) {
    product(slug: $slug) {
      ...ProductFragment
      reviews {
        id
        rating
        comment
      }
    }
  }
  ${ProductFragment}
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