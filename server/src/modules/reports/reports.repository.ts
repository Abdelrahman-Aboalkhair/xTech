import { PrismaClient } from "@prisma/client";
import { DateRangeQuery } from "./reports.types";

export class ReportsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createReport(data: {
    type: string;
    format: string;
    userId: string;
    parameters: DateRangeQuery;
    filePath: string | null;
  }) {
    return this.prisma.report.create({
      data: {
        type: data.type,
        format: data.format,
        userId: data.userId,
        parameters: data.parameters,
        filePath: data.filePath,
        createdAt: new Date(),
      },
    });
  }
}
