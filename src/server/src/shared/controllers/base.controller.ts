import { Request, Response } from 'express';
import asyncHandler from '@/shared/utils/asyncHandler';
import sendResponse from '@/shared/utils/sendResponse';
import { BaseService } from '@/shared/services/base.service';
import { makeLogsService } from '@/modules/logs/logs.factory';

/**
 * Generic Base Controller
 * Provides standard CRUD endpoints
 */
export abstract class BaseController<T> {
    protected logsService = makeLogsService();

    constructor(protected readonly service: BaseService<T>) { }

    create = asyncHandler(async (req: Request, res: Response) => {
        const start = Date.now();
        const data = req.body;
        const result = await this.service.create(data);
        sendResponse(res, 201, {
            data: result,
            message: `${this.getEntityName()} created successfully`,
        });
        const end = Date.now();
        this.logsService.info(`${this.getEntityName()} created`, {
            userId: req.user?.id,
            sessionId: req.session?.id,
            timePeriod: end - start,
        });
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.service.getById(id);
        sendResponse(res, 200, {
            data: result,
            message: `${this.getEntityName()} fetched successfully`,
        });
    });

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.getAll(req.query);
        sendResponse(res, 200, {
            data: { [this.getEntityName() + 's']: result },
            message: `${this.getEntityName()}s fetched successfully`,
        });
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const result = await this.service.update(id, data);
        sendResponse(res, 200, {
            data: result,
            message: `${this.getEntityName()} updated successfully`,
        });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.service.delete(id);
        sendResponse(res, 204, {
            message: `${this.getEntityName()} deleted successfully`,
        });
        const start = Date.now();
        const end = Date.now();
        this.logsService.info(`${this.getEntityName()} deleted`, {
            userId: req.user?.id,
            sessionId: req.session?.id,
            timePeriod: end - start,
        });
    });

    /**
     * Abstract method to return the entity name (e.g., 'Category', 'Product')
     */
    protected abstract getEntityName(): string;
}