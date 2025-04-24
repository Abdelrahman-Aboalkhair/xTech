import React from "react";

interface ChatHeaderProps {
  chat: any;
  onResolve: () => void;
  canResolve: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onResolve,
  canResolve,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="font-semibold text-lg">Support Chat</h2>
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                chat?.status === "OPEN" ? "bg-green-400" : "bg-gray-400"
              }`}
            ></span>
            <span className="text-sm text-blue-100">
              {chat?.status === "OPEN" ? "Active" : "Resolved"}
            </span>
          </div>
        </div>

        {canResolve && (
          <button
            onClick={onResolve}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
