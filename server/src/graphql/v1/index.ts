import { ApolloServer } from "@apollo/server";
import { combinedResolvers } from "./resolvers";
import { combinedSchemas } from "./schema";

export const serverV1 = new ApolloServer({
  typeDefs: combinedSchemas,
  resolvers: combinedResolvers,
  introspection: process.env.NODE_ENV !== "production",
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
});
