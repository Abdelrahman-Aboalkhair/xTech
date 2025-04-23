import { PrismaClient } from "@prisma/client";
import { LogEntry } from "./logs.types";

export class LogsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getLogs() {
    return this.prisma.log.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });
  }

  async getLogById(id: string) {
    return this.prisma.log.findUnique({
      where: { id },
    });
  }
  async getLogsByLevel(level: string) {
    return this.prisma.log.findMany({
      where: { level },
    });
  }

  async deleteLog(id: string) {
    return this.prisma.log.delete({
      where: { id },
    });
  }

  async clearLogs() {
    return this.prisma.log.deleteMany();
  }

  async createLog(data: LogEntry) {
    return this.prisma.log.create({
      data: {
        level: data.level,
        message: data.message,
        context: data.context,
      },
    });
  }
}
