import React, { useState } from "react";
import { format } from "date-fns";
import {
  Download,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
} from "lucide-react";
import Image from "next/image";

interface MessageItemProps {
  message: any;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon size={16} />;
    } else if (["mp3", "wav", "ogg"].includes(extension || "")) {
      return <Music size={16} />;
    } else if (["mp4", "webm", "mov"].includes(extension || "")) {
      return <Video size={16} />;
    } else {
      return <FileText size={16} />;
    }
  };

  const renderMessageContent = () => {
    if (message.content) {
      return (
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      );
    } else if (message.fileUrl) {
      const extension = message.fileUrl.split(".").pop()?.toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return (
          <div className="relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                <ImageIcon className="text-gray-400" size={24} />
              </div>
            )}
            {imageError ? (
              <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500 text-sm rounded">
                Unable to load image
              </div>
            ) : (
              <Image
                src={message.fileUrl}
                alt="Attached image"
                className={`max-w-full max-h-60 rounded ${
                  !imageLoaded ? "invisible" : ""
                }`}
                width={500}
                height={300}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </div>
        );
      } else if (["mp3", "wav", "ogg"].includes(extension)) {
        return (
          <audio controls className="max-w-full">
            <source src={message.fileUrl} type={`audio/${extension}`} />
            Your browser does not support the audio element.
          </audio>
        );
      } else {
        return (
          <a
            href={message.fileUrl}
            download
            className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            {getFileIcon(message.fileUrl)}
            <span className="text-sm truncate max-w-xs">
              {message.fileUrl.split("/").pop()}
            </span>
            <Download size={16} className="ml-auto" />
          </a>
        );
      }
    }

    return null;
  };

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className="flex flex-col max-w-xs md:max-w-md">
        {!isCurrentUser && message.sender && (
          <span className="text-xs text-gray-500 ml-2 mb-1">
            {message.sender.name || "User"}
          </span>
        )}

        <div
          className={`rounded-2xl py-2 px-4 break-words ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          {renderMessageContent()}
        </div>

        <div
          className={`text-xs text-gray-500 mt-1 ${
            isCurrentUser ? "text-right mr-2" : "ml-2"
          }`}
        >
          {format(new Date(message.createdAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
