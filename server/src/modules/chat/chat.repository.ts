import prisma from "@/infra/database/database.config";
import { Chat, ChatMessage } from "@prisma/client";

export class ChatRepository {
  constructor() {}

  async createChat(userId: string): Promise<Chat> {
    return prisma.chat.create({
      data: {
        userId,
        status: "OPEN",
      },
      include: { user: true, messages: { include: { sender: true } } },
    });
  }

  async findChatById(id: string): Promise<Chat | null> {
    return prisma.chat.findUnique({
      where: { id },
      include: { user: true, messages: { include: { sender: true } } },
    });
  }

  async findChatsByUser(userId: string): Promise<Chat[]> {
    return prisma.chat.findMany({
      where: { userId },
      include: { user: true, messages: { include: { sender: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findAllChats(): Promise<Chat[]> {
    return prisma.chat.findMany({
      include: { user: true, messages: { include: { sender: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async createMessage(
    chatId: string,
    senderId: string,
    content: string
  ): Promise<ChatMessage> {
    return prisma.chatMessage.create({
      data: {
        chatId,
        senderId,
        content,
      },
      include: { sender: true, chat: true },
    });
  }

  async updateChatStatus(
    chatId: string,
    status: "OPEN" | "RESOLVED"
  ): Promise<Chat> {
    return prisma.chat.update({
      where: { id: chatId },
      data: { status },
      include: { user: true, messages: { include: { sender: true } } },
    });
  }
}
