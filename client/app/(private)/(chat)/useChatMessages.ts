import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

export const useChatMessages = (
  chatId: string,
  user: { id: string; name: string; role: string },
  chat: any,
  socket: Socket | null,
  sendMessage: any
) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeoutRef] = useState<NodeJS.Timeout | null>(
    null
  );

  // Update messages when chat data is fetched
  useEffect(() => {
    if (chat?.messages) {
      setMessages((prev) => {
        const newMessages = chat.messages.filter(
          (msg: any) => !prev.some((m) => m.id === msg.id)
        );
        return [...prev, ...newMessages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    }
  }, [chat]);

  // Handle real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        // Normalize sender field
        const normalizedMessage = {
          ...newMessage,
          sender: newMessage.sender || { id: newMessage.senderId },
        };
        // Update existing message or append new one
        const existingIndex = prev.findIndex(
          (msg) => msg.id === normalizedMessage.id
        );
        if (existingIndex !== -1) {
          // Replace existing message with normalized version
          const updatedMessages = [...prev];
          updatedMessages[existingIndex] = normalizedMessage;
          return updatedMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        // Append new message
        return [...prev, normalizedMessage].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on("userTyping", (typingUser) => {
      if (typingUser.id !== user.id) {
        setIsTyping(true);
        const timeout = setTimeout(() => setIsTyping(false), 3000);
        setTypingTimeoutRef(timeout);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [socket, user.id, typingTimeout]);

  // Emit typing event
  useEffect(() => {
    if (message && socket) {
      socket.emit("typing", { chatId, user });
    }
  }, [message, socket, chatId, user]);

  // Send a message
  const handleSendMessage = async (file?: File) => {
    if (!message.trim() && !file) return;

    try {
      const result = await sendMessage({
        chatId,
        content: message || undefined,
        file,
      }).unwrap();
      console.log("result => ", result);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    isTyping,
  };

  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    isTyping,
  };
};
