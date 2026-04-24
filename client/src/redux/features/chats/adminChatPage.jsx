import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "./chatApi";
import { joinConversation } from "../../../utils/socket";

export default function AdminChatPage() {
  const dispatch = useDispatch();
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

  // RESET SCROLL
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!prevScrollHeight.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [selectedConvo?._id]);

  // MERGE PAGINATION
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

  // SOCKET
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
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;

        return [...prev, message];
      });
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [selectedConvo?._id, userId]);

  // AUTO SCROLL
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevScrollHeight.current) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [allMessages]);

  // LOAD MORE
  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop <= 10 && messageData?.pagination?.hasMore) {
      prevScrollHeight.current = el.scrollHeight;
      setPage((prev) => prev + 1);
    }
  };

  // SEND
  const handleSend = async () => {
    if (!message.trim() || !selectedConvo?._id) return;

    try {
      await sendMessage({
        conversationId: selectedConvo._id,
        text: message.trim(),
        userId,
      }).unwrap();

      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid h-[600px] grid-cols-[300px,1fr] border rounded-2xl overflow-hidden bg-white">

      {/* LEFT PANEL */}
      <div className="flex flex-col min-h-0 border-r">
        <div className="p-3 font-semibold border-b bg-gray-50">
          Chats
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => {
                setSelectedConvo(c);
                setAllMessages([]);
                setPage(1);
              }}
              className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
                selectedConvo?._id === c._id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">{c.car?.title}</p>
              <p className="text-xs text-gray-500 truncate">
                {c.lastMessage?.text || "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col h-full min-h-0">

        {!selectedConvo ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 p-3 border-b bg-gray-50">
              <button
                onClick={() => {
                  setSelectedConvo(null);
                  setAllMessages([]);
                  setPage(1);
                }}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                ←
              </button>

              <div>
                <p className="font-semibold">
                  {selectedConvo.car?.title}
                </p>
                <p className="text-xs text-gray-500">
                  Conversation
                </p>
              </div>
            </div>

            {/* MESSAGES */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto bg-gray-50"
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
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl text-sm max-w-xs break-words shadow ${
                        isMe
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border"
                      }`}
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
            <div className="flex items-end gap-2 p-3 bg-white border-t">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type message..."
              />

              <button
                onClick={handleSend}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
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