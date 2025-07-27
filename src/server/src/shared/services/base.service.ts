import { IBaseRepository } from '@/shared/interfaces/base-repository.interface';
import AppError from '@/shared/errors/AppError';
import ApiFeatures from '@/shared/utils/ApiFeatures';

/**
 * Generic Base Service
 * Handles common CRUD business logic
 */
export abstract class BaseService<T> {
    constructor(protected readonly repository: IBaseRepository<T>) { }

    async create(data: T): Promise<{ [key: string]: any }> {
        try {
            const result = await this.repository.create(data);
            return { [this.getEntityName()]: result };
        } catch (error) {
            throw new AppError(400, `Failed to create ${this.getEntityName()}`);
        }
    }

    async getById(id: string): Promise<{ [key: string]: any }> {
        const result = await this.repository.findById(id);
        if (!result) {
            throw new AppError(404, `${this.getEntityName()} not found`);
        }
        return { [this.getEntityName()]: result };
    }

    async getAll(queryString: Record<string, any>): Promise<T[]> {
        const apiFeatures = new ApiFeatures(queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .build();

        const { where, orderBy, skip, take } = apiFeatures;
        return this.repository.findAll({
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            skip,
            take,
        });
    }

    async update(id: string, data: Partial<T>): Promise<{ [key: string]: any }> {
        const result = await this.repository.findById(id);
        if (!result) {
            throw new AppError(404, `${this.getEntityName()} not found`);
        }
        const updated = await this.repository.update(id, data);
        return { [this.getEntityName()]: updated };
    }

    async delete(id: string): Promise<void> {
        const result = await this.repository.findById(id);
        if (!result) {
            throw new AppError(404, `${this.getEntityName()} not found`);
        }
        await this.repository.delete(id);
    }

    /**
     * Abstract method to return the entity name (e.g., 'category', 'product')
     */
    protected abstract getEntityName(): string;
}