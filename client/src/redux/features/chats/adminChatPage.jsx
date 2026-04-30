import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./chatApi";
import { joinConversation } from "../../../utils/socket";
import { Send } from "lucide-react";

export default function AdminChatPage() {
  const userId = useSelector((state) => state.auth?.user?._id);

  const containerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  const [selectedConvo, setSelectedConvo] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState([]);

  const { data } = useGetConversationsQuery({ page: 1, limit: 50 });
  const conversations = data?.data || [];

  const { data: messageData } = useGetMessagesQuery(
    { conversationId: selectedConvo?._id, page, limit: 50 },
    { skip: !selectedConvo }
  );

  const [sendMessage] = useSendMessageMutation();

  /* RESET ON CONVO CHANGE */
  useEffect(() => {
    setAllMessages([]);
    setPage(1);
  }, [selectedConvo?._id]);

  /* MERGE MESSAGES */
  useEffect(() => {
    if (!messageData?.data) return;

    const incoming = [...messageData.data].reverse();

    setAllMessages((prev) => {
      const ids = new Set(prev.map((m) => m._id));
      const merged = [
        ...incoming.filter((m) => !ids.has(m._id)),
        ...prev,
      ];

      return merged.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
  }, [messageData]);

  /* SOCKET */
  useEffect(() => {
    const socket = joinConversation(selectedConvo?._id);
    if (!socket || !selectedConvo) return;

    const handler = ({ message }) => {
      if (message.conversation !== selectedConvo._id) return;

      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      if (senderId === userId) return;

      setAllMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [selectedConvo?._id, userId]);

  /* SCROLL LOAD MORE */
  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop <= 10 && messageData?.pagination?.hasMore) {
      prevScrollHeight.current = el.scrollHeight;
      setPage((p) => p + 1);
    }
  };

  /* PRESERVE SCROLL POSITION */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevScrollHeight.current) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [allMessages]);

  /* SEND */
  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      conversationId: selectedConvo._id,
      text: message.trim(),
      userId,
    });

    setMessage("");
  };

  /* 🔁 REUSABLE CHAT UI */
  const renderChat = (showBack = false) => {
    if (!selectedConvo) return null;

    return (
      <div className="flex flex-col h-full bg-white">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          {showBack && (
            <button
              onClick={() => setSelectedConvo(null)}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              ←
            </button>
          )}

          <p className="text-sm font-semibold">
            {selectedConvo.car?.title}
          </p>
        </div>

        {/* MESSAGES */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 px-4 py-4 space-y-3 overflow-y-auto bg-gray-50"
        >
          {allMessages.map((msg) => {
            const senderId =
              typeof msg.sender === "object"
                ? msg.sender._id
                : msg.sender;

            const isMe = senderId === userId;

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2 border rounded-full">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 outline-none"
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50 border rounded-2xl overflow-hidden">

      {/* 💻 DESKTOP */}
     <div className="hidden h-full gap-4 p-4 bg-gray-100 md:flex">

  {/* LEFT PAGE */}
  <div className="w-[320px] bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden">
    <div className="px-4 py-3 font-semibold border-b">
      Conversations
    </div>

    <div className="flex-1 overflow-y-auto">
      {conversations.map((c) => (
        <button
          key={c._id}
          onClick={() => setSelectedConvo(c)}
          className={`w-full text-left px-4 py-3 border-b ${
            selectedConvo?._id === c._id
              ? "bg-indigo-50"
              : "hover:bg-gray-50"
          }`}
        >
          <p className="text-sm font-semibold truncate">
            {c.car?.title}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {c.lastMessage?.text || "No messages yet"}
          </p>
        </button>
      ))}
    </div>
  </div>

  {/* RIGHT PAGE */}
  <div className="flex flex-col flex-1 overflow-hidden bg-white border shadow-sm rounded-2xl">
    {!selectedConvo ? (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation
      </div>
    ) : (
      renderChat(false)
    )}
  </div>
</div>

      {/* 📱 MOBILE */}
      <div className="h-full md:hidden">
        {!selectedConvo ? (
          <div className="flex flex-col h-full bg-white">
            <div className="px-4 py-3 font-semibold border-b">
              Conversations
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedConvo(c)}
                  className="w-full px-4 py-3 text-left border-b"
                >
                  {c.car?.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          renderChat(true)
        )}
      </div>
    </div>
  );
}