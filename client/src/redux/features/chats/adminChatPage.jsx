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

  const prevScrollHeight = useRef(0);
  const containerRef = useRef(null);

  const [selectedConvo, setSelectedConvo] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState([]);

  const { data } = useGetConversationsQuery({ page: 1, limit: 50 });
  const conversations = data?.data || [];

  const { data: messageData, isFetching } = useGetMessagesQuery(
    { conversationId: selectedConvo?._id, page, limit: 50 },
    { skip: !selectedConvo }
  );

  const [sendMessage] = useSendMessageMutation();

  /* RESET */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!prevScrollHeight.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [selectedConvo?._id]);

  /* MERGE */
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

  /* SCROLL */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevScrollHeight.current) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [allMessages]);

  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop <= 10 && messageData?.pagination?.hasMore) {
      prevScrollHeight.current = el.scrollHeight;
      setPage((p) => p + 1);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      conversationId: selectedConvo._id,
      text: message.trim(),
      userId,
    });

    setMessage("");
  };

  return (
    <div className="grid h-[calc(100vh-80px)] grid-cols-[320px,1fr] bg-gray-50 rounded-2xl overflow-hidden border">

      {/* LEFT */}
      <div className="flex flex-col bg-white border-r">

        <div className="px-4 py-3 font-semibold border-b">
          Conversations
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c._id}
              onClick={() => {
                setSelectedConvo(c);
                setAllMessages([]);
                setPage(1);
              }}
              className={`w-full text-left px-4 py-3 border-b transition
                ${
                  selectedConvo?._id === c._id
                    ? "bg-indigo-50"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <p className="text-sm font-semibold text-gray-800 truncate">
                {c.car?.title}
              </p>

              <p className="text-xs text-gray-500 truncate mt-1">
                {c.lastMessage?.text || "No messages yet"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col bg-white">

        {!selectedConvo ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <button
                onClick={() => {
                  setSelectedConvo(null);
                  setAllMessages([]);
                  setPage(1);
                }}
                className="px-2 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                ←
              </button>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedConvo.car?.title}
                </p>
                <p className="text-xs text-gray-400">
                  Active chat
                </p>
              </div>
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
                      className={`
                        max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm
                        ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-md"
                            : "bg-white border text-gray-800 rounded-bl-md"
                        }
                      `}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isFetching && (
                <p className="text-xs text-center text-gray-400">
                  Loading...
                </p>
              )}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-full bg-gray-50">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm bg-transparent outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />

                <button
                  onClick={handleSend}
                  className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}