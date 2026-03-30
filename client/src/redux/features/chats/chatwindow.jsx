import { useEffect, useState } from "react";
import { getSocket } from "../../../utils/socket.js";
import { useGetMessagesQuery, useSendMessageMutation } from "./chatApi.js";

export default function ChatWindow({ conversationId }) {
  const [text, setText] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [sendError, setSendError] = useState("");

  const { data, isLoading } = useGetMessagesQuery(
    { conversationId, page: 1 },
    { skip: !conversationId }
  );
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const messages = data?.data || [];

  useEffect(() => {
    setLiveMessages([]);
  }, [conversationId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = (msg) => {
      const incomingConversationId = msg.conversationId || msg.conversation;

      if (incomingConversationId?.toString() === conversationId?.toString()) {
        setLiveMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [conversationId]);

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || !conversationId) return;

    setSendError("");

    try {
      const response = await sendMessage({
        conversationId,
        text: trimmedText
      }).unwrap();

      if (response?.data) {
        setLiveMessages((prev) => [...prev, response.data]);
      }

      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setSendError(error?.data?.message || "Unable to send message.");
    }
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation
      </div>
    );
  }

  const allMessages = [...messages.slice().reverse(), ...liveMessages].filter(
    (msg, index, self) => index === self.findIndex((m) => m._id === msg._id)
  );

  return (
    <>
      <div className="p-4 font-semibold border-b">Chat</div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          allMessages.map((msg, i) => (
            <div key={msg._id || i} className="mb-2">
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        {sendError && (
          <p className="mb-2 text-sm text-red-600">{sendError}</p>
        )}

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !text.trim() || !conversationId}
            className="px-4 text-white bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}