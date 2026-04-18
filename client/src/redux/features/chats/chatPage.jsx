import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGetConversationsQuery } from "./chatApi";
import ChatWindow from "./chatwindow.jsx";


export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetConversationsQuery();
  const conversations = data?.data || [];

  return (
<div className="flex h-[calc(100vh-60px)]">

  <div className="p-2 ">
    <button
        onClick={() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/chat");
    }
  }}
      className="p-2 rounded-full hover:bg-gray-200 block md:hidden"
    >
      <ArrowLeft />
    </button>

      <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-full hover:bg-gray-200 hidden md:block"
    >
      <ArrowLeft />
    </button>
  </div>

  {/* LEFT SIDEBAR */}
  <div className="hidden w-1/3 overflow-y-auto border-r md:block">
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
          className={`p-4 cursor-pointer hover:bg-gray-400 ${
            conversationId === conv._id ? "bg-gray-500" : ""
          }`}
        >
          <p className="font-medium">
            {conv.car?.title || "Car Chat"}
          </p>

          <p className="text-sm truncate text-foreground">
            {conv.lastMessage?.text || "No messages yet"}
          </p>
        </div>
      ))
    )}
  </div>

      {/* RIGHT */}
      <div className="flex flex-col flex-1">
<ChatWindow
  conversation={conversations.find(c => c._id === conversationId)}
/>      </div>
    </div>
  );
}