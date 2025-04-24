import React, { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: any[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message: any) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {Object.entries(groupedMessages).map(
        ([date, dateMessages]: [string, any]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                {date === new Date().toLocaleDateString()
                  ? "Today"
                  : date ===
                    new Date(Date.now() - 86400000).toLocaleDateString()
                  ? "Yesterday"
                  : date}
              </div>
            </div>

            {dateMessages.map((msg: any) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.sender.id === currentUserId}
              />
            ))}
          </div>
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
