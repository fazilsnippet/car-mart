import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "./chatwindow";
import { useGetConversationsQuery } from "./chatApi.js";
import { ArrowLeft } from "lucide-react";
export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetConversationsQuery();
  const conversations = data?.data || [];
  const activeConversation = conversations.find(
    (conv) => conv._id === conversationId
  );

  return (
    <div className="flex h-[calc(100vh-60px)]">
      <button onClick={() => window.history.back()}>
          <ArrowLeft />
        </button>
      {/* =========================
          LEFT: Conversations
      ========================= */}
      <div className="w-1/3 overflow-y-auto border-r">
        <h2 className="p-4 font-semibold">Conversations</h2>

        {isLoading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-gray-500">No conversations</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => navigate(`/chat/${conv._id}`)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                conversationId === conv._id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">
                {conv.car?.title || "Car Chat"}
              </p>

              <p className="text-sm text-gray-500 truncate">
                {conv.lastMessage?.text || "No messages yet"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* =========================
          RIGHT: Chat Window
      ========================= */}
      <div className="flex flex-col flex-1">
        <ChatWindow
          conversationId={conversationId}
          conversation={activeConversation}
        />
      </div>
    </div>
  );
}