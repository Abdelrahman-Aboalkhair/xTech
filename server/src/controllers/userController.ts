import { Request, Response } from "express";
import * as userService from "../services/userService";
import asyncHandler from "../utils/asyncHandler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);

  res.status(500).json({ message: "Error fetching users" });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(parseInt(req.params.id));
  res.json(user);

  res.status(500).json({ message: "Error fetching user" });
});

export const getUserByEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(user);

    res.status(500).json({ message: "Error fetching user" });
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(parseInt(req.params.id));
  res.json(user);

  res.status(400).json({ message: "Error fetching user" });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(parseInt(req.params.id), req.body);
  res.json(user);

  res.status(400).json({ message: "Error updating user" });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(parseInt(req.params.id));
  res.sendStatus(204);

  res.status(400).json({ message: "Error deleting user" });
});
