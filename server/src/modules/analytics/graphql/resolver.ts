import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import productPerformance from "./resolvers/productPerformance";
import analyticsOverview from "./resolvers/analyticsOverview";
import yearRange from "./resolvers/yearRange";
import customerAnalytics from "./resolvers/customerAnalytics";
import interactionAnalytics from "./resolvers/interactionAnalytics";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const analyticsResolvers = {
  Query: {
    ...analyticsOverview.Query,
    ...yearRange.Query,
    ...customerAnalytics.Query,
    ...interactionAnalytics.Query,
    ...productPerformance.Query,
  },
};
