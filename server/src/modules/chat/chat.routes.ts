import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { makeChatController } from "./chat.factory";
import protect from "@/shared/middlewares/protect";
import upload from "@/shared/middlewares/upload";

export const configureChatRoutes = (io: SocketIOServer) => {
  const router = express.Router();
  const chatController = makeChatController(io);

  // Routes
  router.get("/", protect, chatController.getAllChats);
  router.post("/", protect, chatController.createChat);
  router.get("/user", protect, chatController.getUserChats);
  router.get("/:id", protect, chatController.getChat);
  router.post(
    "/:chatId/message",
    protect,
    upload.single("file"),
    chatController.sendMessage
  );
  router.patch("/:chatId/status", protect, chatController.updateChatStatus);

  return router;
};
