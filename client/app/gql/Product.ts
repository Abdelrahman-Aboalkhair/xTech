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
        attributes {
          id
          attribute {
            id
            name
            type
            slug
          }
          value {
            id
            value
            slug
          }
          customValue
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
      attributes {
        id
        attribute {
          id
          name
          type
          slug
        }
        value {
          id
          value
          slug
        }
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



export const GET_INVENTORY_SUMMARY = gql`
  query GetInventorySummary($params: InventorySummaryParamsInput!) {
    inventorySummary(params: $params) {
      product {
        id
        name
        stock
        attributes {
          id
          attributeId
          valueId
          stock
          attribute {
            id
            name
            type
            values {
              id
              value
            }
          }
          value {
            id
            value
          }
        }
      }
      stock
      lowStock
    }
  }
`;

export const GET_STOCK_MOVEMENTS = gql`
  query getStockMovements(
    $productId: ID
    $startDate: DateTime
    $endDate: DateTime
  ) {
    stockMovements(
      productId: $productId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      product {
        id
        name
      }
      quantity
      reason
      userId
      createdAt
    }
  }
`;


export const GET_RESTOCKS = gql`
  query GetRestocks($params: RestockParamsInput!) {
    restocks(params: $params) {
      id
      product {
        id
        name
      }
      quantity
      notes
      userId
      createdAt
      attributes {
        attributeId
        valueId
        valueIds
        attribute {
          id
          name
          type
          values {
            id
            value
          }
        }
        values {
          id
          value
        }
      }
    }
  }
`;

export const RESTOCK_PRODUCT = gql`
  mutation RestockProduct($productId: ID!, $quantity: Int!, $notes: String) {
    restockProduct(productId: $productId, quantity: $quantity, notes: $notes) {
      id
      product {
        id
        name
        stock
      }
      quantity
      notes
      createdAt
    }
  }
`;

export const SET_LOW_STOCK_THRESHOLD = gql`
  mutation SetLowStockThreshold($productId: ID!, $threshold: Int!) {
    setLowStockThreshold(productId: $productId, threshold: $threshold) {
      id
      name
      stock
      lowStockThreshold
    }
  }
`;

export const GET_PRODUCT_ATTRIBUTES = gql`
  query GetProductAttributes($productId: String!) {
    getProductAttributes(productId: $productId) {
      id
      attributeId
      valueId
      stock
      attribute {
        id
        name
        type
        values {
          id
          value
        }
      }
      value {
        id
        value
      }
    }
  }
`;