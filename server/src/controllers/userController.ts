import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import UserService from "../services/userService";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getAllUsers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const users = await this.userService.getAllUsers();
      sendResponse(res, 200, { users }, "Users fetched successfully");
    }
  );

  getUserById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      sendResponse(res, 200, { user }, "User fetched successfully");
    }
  );

  getUserByEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;
      const user = await this.userService.getUserByEmail(email);
      sendResponse(res, 200, { user }, "User fetched successfully");
    }
  );

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id;
    console.log("id: ", id);
    const user = await this.userService.getMe(id);
    console.log("user: ", user);
    sendResponse(res, 200, { user }, "User profile fetched successfully");
  });

  updateMe = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedData = req.body;
      const user = await this.userService.updateMe(id, updatedData);
      sendResponse(res, 200, { user }, "User updated successfully");
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      sendResponse(res, 204, {}, "User deleted successfully");
    }
  );
}

export default new UserController(new UserService());
