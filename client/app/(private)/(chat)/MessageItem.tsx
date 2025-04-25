import { formatMessageTime } from "@/app/utils/messageFormatter";
import Image from "next/image";
import React from "react";
import AudioPlayer from "./AudioPlayer";

interface MessageItemProps {
  message: any;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-xs md:max-w-md space-x-2">
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-sm font-medium">
              {message.sender.name.charAt(0)}
            </div>
          </div>
        )}

        <div
          className={`p-3 rounded-2xl ${
            message.type === "IMAGE" || message.type === "VOICE"
              ? "p-0 bg-transparent"
              : isCurrentUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none shadow-sm"
          }`}
        >
          {!isCurrentUser && (
            <p className="text-xs font-medium mb-1">{message.sender.name}</p>
          )}

          {message.type === "TEXT" && <p>{message.content}</p>}
          {message.type === "IMAGE" && (
            <Image
              src={message.url}
              alt="Chat image"
              width={500}
              height={300}
              className="object-cover rounded-lg"
            />
          )}
          {message.type === "VOICE" && <AudioPlayer src={message.url} />}

          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-indigo-500" : "text-gray-500"
            }`}
          >
            {formatMessageTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
