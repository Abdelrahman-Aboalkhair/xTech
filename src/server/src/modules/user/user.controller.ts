import { Request, Response } from "express";
import { UserService } from "./user.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { makeLogsService } from "../logs/logs.factory";

export class UserController {
  private logsService = makeLogsService();
  constructor(private userService: UserService) {}

  getAllUsers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const users = await this.userService.getAllUsers();
      sendResponse(res, 200, {
        data: { users },
        message: "Users fetched successfully",
      });
    }
  );

  getUserById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      sendResponse(res, 200, {
        data: { user },
        message: "User fetched successfully",
      });
    }
  );

  getUserByEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;
      const user = await this.userService.getUserByEmail(email);
      sendResponse(res, 200, {
        data: { user },
        message: "User fetched successfully",
      });
    }
  );

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id;
    console.log("id: ", id);
    const user = await this.userService.getMe(id);
    console.log("user: ", user);
    sendResponse(res, 200, {
      data: { user },
      message: "User fetched successfully",
    });
  });

  updateMe = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedData = req.body;
      const user = await this.userService.updateMe(id, updatedData);
      sendResponse(res, 200, {
        data: { user },
        message: "User updated successfully",
      });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("User updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      sendResponse(res, 204, { message: "User deleted successfully" });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("User deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );
}
