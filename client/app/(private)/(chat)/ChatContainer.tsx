import React from "react";
import {
  useGetChatQuery,
  useSendMessageMutation,
  useUpdateChatStatusMutation,
} from "@/app/store/apis/ChatApi";
import { useSocketConnection } from "./useSocketConnection";
import { useChatMessages } from "./useChatMessages";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatStatus from "./ChatStatus";
import ChatInput from "./ChatInput";
import CustomLoader from "@/app/components/feedback/CustomLoader";
import { useGetMeQuery } from "@/app/store/apis/UserApi";
import { useWebRTCCall } from "./useWebRTCCall";
import { PhoneCall } from "lucide-react";

interface ChatProps {
  chatId: string;
}

const ChatContainer: React.FC<ChatProps> = ({ chatId }) => {
  const { data: userData } = useGetMeQuery(undefined);
  const user = userData?.user;

  const { data, isLoading, error } = useGetChatQuery(chatId);
  const chat = data?.chat;

  const [sendMessage] = useSendMessageMutation();
  const [updateChatStatus] = useUpdateChatStatusMutation();

  const socket = useSocketConnection(chatId);

  const { messages, message, setMessage, handleSendMessage, isTyping } =
    useChatMessages(chatId, user, chat, socket, sendMessage);

  const { callStatus, startCall, endCall, localVideoRef, remoteVideoRef } =
    useWebRTCCall({ chatId, socket });

  const handleResolveChat = async () => {
    try {
      await updateChatStatus({ chatId, status: "RESOLVED" }).unwrap();
    } catch (err) {
      console.error("Failed to resolve chat:", err);
    }
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-300 text-red-600 px-6 py-4 rounded-lg shadow-sm">
          Error: {(error as any).data?.message || "Failed to load chat"}
        </div>
      </div>
    );
  }

  const canResolve =
    (user.role === "ADMIN" || user.role === "SUPERADMIN") &&
    chat?.status === "OPEN";

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
      <ChatHeader
        chat={chat}
        onResolve={handleResolveChat}
        canResolve={canResolve}
      />
      <MessageList messages={messages} currentUserId={user.id} />
      {isTyping && <ChatStatus isTyping={true} />}
      {callStatus === "idle" && chat?.status === "OPEN" && (
        <button
          onClick={startCall}
          className="flex items-center gap-2 p-3 w-fit mx-4 my-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          <PhoneCall size={20} />
          Start Call
        </button>
      )}
      {callStatus === "calling" && (
        <div className="p-4 text-yellow-600 bg-yellow-50">
          Connecting call...
        </div>
      )}
      {callStatus === "in-call" && (
        <div className="p-4 flex flex-col space-y-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-medium">
              Video call in progress
            </span>
            <button
              onClick={endCall}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              End Call
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500">You</p>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-48 rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Remote</p>
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-48 rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
      {callStatus === "ended" && (
        <div className="p-4 text-gray-600 bg-gray-50">Call ended</div>
      )}
      {chat?.status === "OPEN" && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
        />
      )}
      {chat?.status !== "OPEN" && (
        <div className="p-4 bg-gray-100 text-center text-gray-500 border-t border-gray-200">
          This conversation has been resolved
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
