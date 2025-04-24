import { ChatRepository } from "./chat.repository";
import { Chat, ChatMessage } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private io: SocketIOServer
  ) {}

  async createChat(userId: string): Promise<Chat> {
    const chat = await this.chatRepository.createChat(userId);
    this.io.emit("chatCreated", chat);
    return chat;
  }

  async getChat(id: string): Promise<Chat | null> {
    const chat = await this.chatRepository.findChatById(id);
    if (!chat) throw new Error("Chat not found");
    return chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatRepository.finduserChats(userId);
  }

  async getAllChats(): Promise<Chat[]> {
    return this.chatRepository.findAllChats();
  }

  async sendMessage(
    chatId: string,
    content: string,
    senderId: string
  ): Promise<ChatMessage> {
    const chat = await this.chatRepository.findChatById(chatId);
    if (!chat) throw new Error("Chat not found");

    const message = await this.chatRepository.createMessage(
      chatId,
      senderId,
      content
    );
    this.io.to(`chat:${chatId}`).emit("newMessage", message);
    return message;
  }

  async updateChatStatus(
    chatId: string,
    status: "OPEN" | "RESOLVED"
  ): Promise<Chat> {
    const chat = await this.chatRepository.updateChatStatus(chatId, status);
    this.io.emit("chatStatusUpdated", chat);
    return chat;
  }
}
