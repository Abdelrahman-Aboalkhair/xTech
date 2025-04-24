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
    category: Category
  }

  type StockMovement {
    id: ID!
    product: Product!
    quantity: Int!
    reason: String!
    userId: String
    createdAt: DateTime!
  }

  type Restock {
    id: ID!
    product: Product!
    quantity: Int!
    notes: String
    userId: String
    createdAt: DateTime!
  }

  type InventorySummary {
    product: Product!
    stock: Int!
    lowStock: Boolean!
  }

  type Mutation {
    restockProduct(productId: ID!, quantity: Int!, notes: String): Restock!
    # Log manual stock adjustments (e.g., for damages or corrections).
    adjustStock(productId: ID!, quantity: Int!, reason: String!): StockMovement!
  }

  scalar DateTime

  type Review {
    id: String!
    rating: Float!
    comment: String
  }

  type Category {
    id: String!
    slug: String!
    name: String!
    description: String
  }

  type ProductConnection {
    products: [Product!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  input ProductFilters {
    search: String
    isNew: Boolean
    isFeatured: Boolean
    isTrending: Boolean
    isBestSeller: Boolean
    minPrice: Float
    maxPrice: Float
    categoryId: String
  }

  type Query {
    products(first: Int, skip: Int, filters: ProductFilters): ProductConnection!
    product(slug: String!): Product
    newProducts(first: Int, skip: Int): ProductConnection!
    featuredProducts(first: Int, skip: Int): ProductConnection!
    trendingProducts(first: Int, skip: Int): ProductConnection!
    bestSellerProducts(first: Int, skip: Int): ProductConnection!
    categories: [Category!]!
    stockMovements(
      productId: ID
      startDate: DateTime
      endDate: DateTime
    ): [StockMovement!]!
    restocks(productId: ID, startDate: DateTime, endDate: DateTime): [Restock!]!
    inventorySummary: [InventorySummary!]!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
