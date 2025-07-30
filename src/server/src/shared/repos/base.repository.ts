import prisma from '@/infra/database/database.config';
import { IBaseRepository } from '@/shared/interfaces/base-repository.interface';

/**
 * Generic Base Repository
 * Provides default implementations for CRUD operations using Prisma
 */
export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly model: any) { } // Prisma model, e.g., prisma.category

    async create(data: T): Promise<T> {
        return prisma.$transaction(async () => {
            return this.model.create({ data });
        });
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(params: {
        where?: Record<string, any>;
        orderBy?: Record<string, any> | Record<string, any>[];
        skip?: number;
        take?: number;
    } = {}): Promise<T[]> {
        const { where, orderBy, skip, take } = params;
        return this.model.findMany({
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            skip,
            take,
        });
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return prisma.$transaction(async () => {
            return this.model.update({ where: { id }, data });
        });
    }

    async delete(id: string): Promise<T> {
        return prisma.$transaction(async () => {
            return this.model.delete({ where: { id } });
        });
    }
}