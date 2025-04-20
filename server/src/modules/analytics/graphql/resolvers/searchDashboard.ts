import { Context } from "@/modules/product/graphql/resolver";
import searchModel from "@/shared/utils/searchModel";

export const searchDashboardResolver = {
  Query: {
    searchDashboard: async (
      _: any,
      { params }: { params: { searchQuery: string } },
      { prisma }: Context
    ) => {
      const { searchQuery } = params;

      // Define searchable fields for each model
      const transactions = await searchModel(
        "transaction",
        [{ name: "status", isString: false }], // Status is an enum
        searchQuery,
        prisma
      );

      const products = await searchModel(
        "product",
        [
          { name: "name", isString: true },
          { name: "description", isString: true },
        ],
        searchQuery,
        prisma
      );

      const categories = await searchModel(
        "category",
        [
          { name: "name", isString: true },
          { name: "description", isString: true },
        ],
        searchQuery,
        prisma
      );

      const users = await searchModel(
        "user",
        [
          { name: "name", isString: true },
          { name: "email", isString: true },
        ],
        searchQuery,
        prisma
      );

      // Combine results
      const results = [
        ...transactions.map((t: any) => ({
          type: "transaction",
          id: t.id,
          title: `Transaction #${t.id}`,
          description: `$${t.amount || 0} - ${t.status || "Pending"}`,
        })),
        ...products.map((p: any) => ({
          type: "product",
          id: p.id,
          title: p.name,
          description: p.description || `$${p.price || 0}`,
        })),
        ...categories.map((c: any) => ({
          type: "category",
          id: c.id,
          title: c.name,
          description: c.description,
        })),
        ...users.map((u: any) => ({
          type: "user",
          id: u.id,
          title: u.name,
          description: u.email,
        })),
      ];

      return results;
    },
  },
};
