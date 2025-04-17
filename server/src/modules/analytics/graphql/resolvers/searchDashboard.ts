import { Context } from "@/modules/product/graphql/resolver";

const searchModel = async (
  model: any,
  fields: string[],
  searchQuery: string,
  prisma: any
) => {
  return await prisma[model].findMany({
    where: {
      OR: fields.map((field) => ({
        [field]: { contains: searchQuery, mode: "insensitive" },
      })),
    },
    select: fields.reduce((acc: any, field: string) => {
      acc[field] = true;
      return acc;
    }, {}),
  });
};

export const searchDashboardResolver = {
  Query: {
    searchDashboard: async (
      _: any,
      { params }: { params: { searchQuery: string } },
      { prisma }: Context
    ) => {
      const { searchQuery } = params;

      const transactions = await searchModel(
        "transaction",
        ["id", "status"],
        searchQuery,
        prisma
      );

      const products = await searchModel(
        "product",
        ["name", "description"],
        searchQuery,
        prisma
      );

      const categories = await searchModel(
        "category",
        ["name", "description"],
        searchQuery,
        prisma
      );

      const users = await searchModel(
        "user",
        ["name", "email"],
        searchQuery,
        prisma
      );

      // Combine results
      const results = [
        ...transactions.map((t: any) => ({
          type: "transaction",
          id: t.id,
          title: `Transaction #${t.id}`,
          description: `$${t.amount} - ${t.status || "Pending"}`,
        })),
        ...products.map((p: any) => ({
          type: "product",
          id: p.id,
          title: p.name,
          description: p.description || `$${p.price}`,
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
