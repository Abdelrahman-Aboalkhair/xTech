import { mergeResolvers } from "@graphql-tools/merge";
import { analyticsResolvers } from "@/modules/analytics/graphql/resolver";

export const combinedResolvers = mergeResolvers([analyticsResolvers]);
