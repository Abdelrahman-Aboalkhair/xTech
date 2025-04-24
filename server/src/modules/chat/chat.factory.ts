import { SocketManager } from "@/infra/socket/socket";
import { ChatController } from "./chat.controller";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";

export const makeChatController = () => {
  const socketManager = new SocketManager(require("http").createServer());
  const io = socketManager.getIO();
  const repo = new ChatRepository();
  const service = new ChatService(repo, io);
  const controller = new ChatController(service);

  return controller;
};
