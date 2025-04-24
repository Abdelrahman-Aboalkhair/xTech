import express, { Request, Response, NextFunction } from "express";
import { makeChatController } from "./chat.factory";
import protect from "@/shared/middlewares/protect";

const router = express.Router();

const chatController = makeChatController();

// Routes
router.get("/:id", protect, chatController.getChat);

router.get("/user/:userId", protect, chatController.getChatsByUser);

router.get("/", protect, chatController.getAllChats);

router.post("/", protect, chatController.createChat);

router.post("/:chatId/message", protect, chatController.sendMessage);

router.patch("/:chatId/status", protect, chatController.updateChatStatus);

export default router;
