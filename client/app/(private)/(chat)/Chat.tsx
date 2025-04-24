import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  useGetChatQuery,
  useSendMessageMutation,
  useUpdateChatStatusMutation,
} from "@/app/store/apis/ChatApi";

interface ChatProps {
  chatId: string;
  user: { id: string; name: string; role: string };
}

const Chat: React.FC<ChatProps> = ({ chatId, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat data using RTK Query
  const { data: chat, isLoading, error } = useGetChatQuery(chatId);

  // Mutations for sending messages and updating status
  const [sendMessage] = useSendMessageMutation();
  const [updateChatStatus] = useUpdateChatStatusMutation();

  // Initialize Socket.IO and handle real-time messages
  useEffect(() => {
    socketRef.current = io(
      process.env.NODE_ENV === "production"
        ? "https://egwinch.com"
        : "http://localhost:5000"
    );
    socketRef.current.emit("joinChat", chatId);

    socketRef.current.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((msg) => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  // Update messages when chat data is fetched
  useEffect(() => {
    if (chat?.messages) {
      setMessages((prev) => {
        // Merge fetched messages, avoiding duplicates
        const newMessages = chat.messages.filter(
          (msg: any) => !prev.some((m) => m.id === msg.id)
        );
        return [...prev, ...newMessages];
      });
    }
  }, [chat]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const result = await sendMessage({ chatId, content: message }).unwrap();
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === result.id)) return prev;
        return [...prev, result];
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Resolve the chat (admin only)
  const handleResolveChat = async () => {
    try {
      await updateChatStatus({ chatId, status: "RESOLVED" }).unwrap();
    } catch (err) {
      console.error("Failed to resolve chat:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {(error as any).data?.message || "Unknown error"}</div>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <div className="bg-blue-600 text-white p-4 flex justify-between">
        <h2>Support Chat</h2>
        {(user.role === "ADMIN" || user.role === "SUPERADMIN") &&
          chat?.status === "OPEN" && (
            <button
              onClick={handleResolveChat}
              className="bg-green-500 px-2 py-1 rounded"
            >
              Resolve
            </button>
          )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.sender.id === user.id ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded ${
                msg.sender.id === user.id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <p className="text-sm">{msg.sender.name}</p>
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {chat?.status === "OPEN" && (
        <div className="p-4 bg-white flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-r"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
