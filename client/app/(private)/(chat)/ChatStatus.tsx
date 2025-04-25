import React from "react";

interface ChatStatusProps {
  isTyping?: boolean;
  status?: string;
}

const ChatStatus: React.FC<ChatStatusProps> = ({ isTyping, status }) => {
  if (!isTyping && !status) return null;

  return (
    <div className="px-4 py-2">
      {isTyping && (
        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex space-x-1 items-center">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="ml-2">Typing...</span>
        </div>
      )}

      {status && <div className="text-gray-500 text-sm">{status}</div>}
    </div>
  );
};

export default ChatStatus;
