import { Context } from "vm";

export const searchDashboardResolver = {
  Query: {
    searchDashboard: async (
      _: any,
      { params }: { params: { searchQuery: string } },
      { prisma }: Context
    ) => {
      const { searchQuery } = params;

      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { id: { contains: searchQuery, mode: "insensitive" } },
            { status: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, amount: true, status: true },
      });

      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { id: { contains: searchQuery, mode: "insensitive" } },
            { status: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, amount: true, status: true },
      });

      const payments = await prisma.payment.findMany({
        where: {
          OR: [
            { id: { contains: searchQuery, mode: "insensitive" } },
            { method: { contains: searchQuery, mode: "insensitive" } },
            { status: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, amount: true, status: true },
      });

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, price: true, description: true },
      });

      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, description: true },
      });

      const themes = await prisma.theme.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { status: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, status: true },
      });

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
          role: { equals: "USER" },
        },
        select: { id: true, name: true, email: true },
      });

      // Combine results
      const results = [
        ...orders.map((o: any) => ({
          type: "order",
          id: o.id,
          title: `Order #${o.id}`,
          description: o.status,
        })),
        ...transactions.map((t: any) => ({
          type: "transaction",
          id: t.id,
          title: `Transaction #${t.id}`,
          description: `$${t.amount} - ${t.status || "Pending"}`,
        })),
        ...payments.map((p: any) => ({
          type: "payment",
          id: p.id,
          title: `Payment #${p.id}`,
          description: `$${p.amount} - ${p.status || "Pending"}`,
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
        ...themes.map((t: any) => ({
          type: "theme",
          id: t.id,
          title: t.name,
          description: t.status,
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
