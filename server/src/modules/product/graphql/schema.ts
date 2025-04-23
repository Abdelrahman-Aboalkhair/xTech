import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { productResolvers } from "./resolver";

const typeDefs = gql`
  type Product {
    id: String!
    slug: String!
    name: String!
    price: Float!
    discount: Float!
    images: [String!]!
    stock: Int!
    isNew: Boolean!
    isFeatured: Boolean!
    isTrending: Boolean!
    isBestSeller: Boolean!
    reviews: [Review!]
  }

  type Review {
    id: String!
    rating: Float!
    comment: String
  }

  # Pagination
  type ProductConnection {
    products: [Product!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  type Query {
    products(first: Int, skip: Int): ProductConnection!
    product(slug: String!): Product
    newProducts(first: Int, skip: Int): ProductConnection!
    featuredProducts(first: Int, skip: Int): ProductConnection!
    trendingProducts(first: Int, skip: Int): ProductConnection!
    bestSellerProducts(first: Int, skip: Int): ProductConnection!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
