import { useState, useEffect, useRef } from "react";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./chatApi";

export default function AdminChatPage() {
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);

  const { data } = useGetConversationsQuery({ page: 1, limit: 50 });
  const conversations = data?.data || [];

  const { data: messageData, isFetching } = useGetMessagesQuery(
    {
      conversationId: selectedConvo?._id,
      page,
      limit: 50,
    },
    { skip: !selectedConvo }
  );

  const [sendMessage] = useSendMessageMutation();

  // =========================
  // 🔥 RESET WHEN SWITCH CHAT
  // =========================
  useEffect(() => {
    setAllMessages([]);
    setPage(1);
  }, [selectedConvo?._id]);

  // =========================
  // 🔥 MERGE PAGINATED DATA
  // =========================
  useEffect(() => {
    if (!messageData?.data) return;

    // API = newest → oldest
    const incoming = [...messageData.data].reverse(); // oldest → newest

    setAllMessages((prev) => {
      const ids = new Set(prev.map((m) => m._id));

      // prepend older messages
      const merged = [
        ...incoming.filter((m) => !ids.has(m._id)),
        ...prev,
      ];

      return merged;
    });
  }, [messageData]);

  // =========================
  // 🔥 AUTO SCROLL (SMART)
  // =========================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [allMessages]);

  // =========================
  // 🔥 LOAD OLDER ON TOP SCROLL
  // =========================
  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && messageData?.pagination?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // =========================
  // 🔥 SEND MESSAGE (NO OPTIMISTIC)
  // =========================
  const handleSend = async () => {
    if (!message.trim() || !selectedConvo?._id) return;

    try {
      await sendMessage({
        conversationId: selectedConvo._id,
        text: message.trim(),
      }).unwrap();

      setMessage("");
      // ❌ do NOT manually update UI
      // socket will handle it
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid h-[600px] grid-cols-[300px,1fr] border rounded-2xl overflow-hidden">

      {/* LEFT */}
      <div className="overflow-y-auto border-r">
        <h2 className="p-3 font-semibold">Chats</h2>

        {conversations.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedConvo(c)}
            className={`p-3 cursor-pointer border-b ${
              selectedConvo?._id === c._id ? "bg-background text-foreground" : ""
            }`}
          >
            <p className="font-semibold">{c.car?.title}</p>
            <p className="text-xs text-gray-500">
              {c.lastMessage?.text || "No messages yet"}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col">
        {!selectedConvo ? (
          <div className="flex items-center justify-center h-full">
            Select a conversation
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-3 border-b font-semibold">
              {selectedConvo.car?.title}
            </div>

            {/* Messages */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-3 space-y-2"
            >
              {allMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs p-2 rounded-lg text-sm ${
                    msg.sender === "admin"
                      ? "bg-blue-500 text-foreground ml-auto"
                      : "bg-background text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isFetching && <p className="text-xs">Loading...</p>}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border px-3 py-2 rounded-lg"
                placeholder="Type message..."
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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