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
    reviews: [Review!]
  }

  type Review {
    id: String!
    rating: Float!
    comment: String
  }

  type Query {
    products: [Product!]
    product(slug: String!): Product
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
