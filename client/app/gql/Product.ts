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
      reviews {
        id
        rating
        comment
      }
    }
  }
`;
