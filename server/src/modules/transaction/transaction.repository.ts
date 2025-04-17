import prisma from "@/infra/database/database.config";
import { PrismaClient } from "@prisma/client";

export class TransactionRepository {
  constructor() {}

  async createTransaction(data: any) {
    return prisma.transaction.create({
      data,
    });
  }
}
