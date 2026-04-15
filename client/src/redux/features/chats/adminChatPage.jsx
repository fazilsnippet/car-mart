import { useState, useMemo } from "react";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./chatApi";

export default function AdminChatPage() {
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const { data, isLoading } = useGetConversationsQuery();
  const conversations = data?.data || [];

  const { data: messageData, isFetching } = useGetMessagesQuery(
    { conversationId: selectedConvo?._id },
    { skip: !selectedConvo }
  );

  const messages = messageData?.data || [];


  // ✅ useMemo → avoid unnecessary re-renders
  const sortedConversations = useMemo(() => {
    return [...conversations].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [conversations]);


const handleSend = async () => {
  if (!message.trim() || !selectedConvo?._id || isSending) return;

  try {
    await sendMessage({
      conversationId: selectedConvo._id,
      text: message.trim(),
    }).unwrap();

    setMessage("");
  } catch (err) {
    console.error("Send failed:", err);
    alert("Message failed to send");
  }
};

  return (
    <div className="grid h-150 grid-cols-[300px,1fr] border rounded-2xl overflow-hidden">

      {/* 🔹 LEFT → Conversations */}
      <div className="overflow-y-auto border-r">
        <h2 className="p-3 font-semibold">Chats</h2>

        {isLoading ? (
          <p className="p-3 text-sm">Loading...</p>
        ) : (
          sortedConversations.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedConvo(c)}
              className={`p-3 cursor-pointer border-b ${
                selectedConvo?._id === c._id ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-semibold">{c.car?.title}</p>
              <p className="text-xs text-gray-500">
                {c.lastMessage?.text || "No messages yet"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🔹 RIGHT → Messages */}
      <div className="flex flex-col">
        {!selectedConvo ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-3 font-semibold border-b">
              {selectedConvo.car?.title}
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {isFetching ? (
                <p>Loading...</p>
              ) : (
                messages
                  .slice()
                  .reverse()
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className={`max-w-xs p-2 rounded-lg text-sm ${
                        msg.sender === "admin"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 text-white bg-black rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}