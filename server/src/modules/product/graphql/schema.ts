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
    slug: String!
    type: String!
    values: [AttributeValue!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AttributeValue {
    id: ID!
    value: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductAttribute {
    id: ID!
    attribute: Attribute!
    value: AttributeValue
    customValue: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CategoryAttribute {
    id: ID!
    attribute: Attribute!
    isRequired: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
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
    stockMovements(
      productId: ID
      startDate: DateTime
      endDate: DateTime
    ): [StockMovement!]!
    restocks(productId: ID, startDate: DateTime, endDate: DateTime): [Restock!]!
    inventorySummary: [InventorySummary!]!
  }

  type Mutation {
    restockProduct(productId: ID!, quantity: Int!, notes: String): Restock!
    adjustStock(productId: ID!, quantity: Int!, reason: String!): StockMovement!
    createAttribute(name: String!, type: String!): Attribute!
    createAttributeValue(attributeId: ID!, value: String!): AttributeValue!
    assignAttributeToCategory(
      attributeId: ID!
      categoryId: ID!
      isRequired: Boolean!
    ): CategoryAttribute!
    assignAttributeToProduct(
      attributeId: ID!
      productId: ID!
      valueId: ID
      customValue: String
    ): ProductAttribute!
    deleteAttribute(id: ID!): Boolean!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
