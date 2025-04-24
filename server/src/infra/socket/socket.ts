import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export class SocketManager {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? "https://egwinch.com"
            : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      // Join specific chat room
      socket.on("joinChat", (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`Client ${socket.id} joined chat:${chatId}`);
      });

      // Join admin room
      socket.on("joinAdmin", () => {
        socket.join("admin");
        console.log(`Client ${socket.id} joined admin room`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}
