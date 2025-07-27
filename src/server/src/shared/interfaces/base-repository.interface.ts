/**
 * Generic Repository Interface
 * Defines standard CRUD operations for any entity
 */
export interface IBaseRepository<T> {
    create(data: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(params?: {
        where?: Record<string, any>;
        orderBy?: Record<string, any> | Record<string, any>[];
        skip?: number;
        take?: number;
    }): Promise<T[]>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T>;
}