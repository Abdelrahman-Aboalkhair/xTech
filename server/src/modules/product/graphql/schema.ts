import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { productResolvers } from "./resolver";

const typeDefs = gql`
  scalar DateTime

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
    attributes: [ProductAttribute!]!
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
    attributes: [CategoryAttribute!]!
  }

  type Attribute {
    id: ID!
    name: String!
    type: String!
    values: [AttributeValue!]!
  }

  type AttributeValue {
    id: ID!
    value: String!
  }

  type ProductAttribute {
    id: ID!
    attributeId: String!
    valueId: String
    customValue: String
    stock: Int!
    attribute: Attribute!
    value: AttributeValue
  }

  type CategoryAttribute {
    id: ID!
    attribute: Attribute!
    isRequired: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input AttributeInput {
    attributeId: String!
    valueId: String
    valueIds: [String!]
    customValue: String
  }

  input RestockProductInput {
    productId: String!
    quantity: Int!
    notes: String
    attributes: [AttributeInput!]
  }

  input RestockParamsInput {
    first: Int
    skip: Int
    productId: String
    startDate: DateTime
    endDate: DateTime
  }

  input InventorySummaryParamsInput {
    first: Int
    skip: Int
    filter: InventoryFilterInput
  }

  input InventoryFilterInput {
    lowStockOnly: Boolean
    productName: String
    attributeFilters: [AttributeInput!]
  }

  input AttributeFilterInput {
    attributeSlug: String!
    valueSlug: String!
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
    attributes: [AttributeFilterInput!]
  }

  type ProductConnection {
    products: [Product!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  type Query {
    products(first: Int, skip: Int, filters: ProductFilters): ProductConnection!
    product(slug: String!): Product
    newProducts(first: Int, skip: Int): ProductConnection!
    featuredProducts(first: Int, skip: Int): ProductConnection!
    trendingProducts(first: Int, skip: Int): ProductConnection!
    bestSellerProducts(first: Int, skip: Int): ProductConnection!
    categories: [Category!]!
    attributes(first: Int, skip: Int): [Attribute!]!
    attribute(id: ID!): Attribute
    getProductAttributes(productId: String!): [ProductAttribute!]!
    stockMovements(
      productId: ID
      startDate: DateTime
      endDate: DateTime
    ): [StockMovement!]!
    restocks(params: RestockParamsInput!): [Restock!]!
    inventorySummary(params: InventorySummaryParamsInput!): [InventorySummary!]!
    stockMovementsByProduct(
      productId: ID!
      startDate: DateTime
      endDate: DateTime
      first: Int
      skip: Int
    ): [StockMovement!]!
  }

  type Mutation {
    restockProduct(input: RestockProductInput!): Restock!
    setLowStockThreshold(productId: ID!, threshold: Int!): Product!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
