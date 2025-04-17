import { PrismaClient } from "@prisma/client";

export class TransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async createTransaction(data: any) {
    return this.prisma.transaction.create({
      data,
    });
  }
}
