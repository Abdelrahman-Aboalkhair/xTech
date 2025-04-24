// src/components/chat/ChatStatus.tsx
import React from "react";

interface ChatStatusProps {
  isTyping: boolean;
}

const ChatStatus: React.FC<ChatStatusProps> = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <div className="px-4 py-2">
      <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
        <span className="ml-2 text-xs text-gray-500">Someone is typing...</span>
      </div>
    </div>
  );
};

export default ChatStatus;
