import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  chatApi,
} from "./chatApi";
import { getSocket } from "../../../utils/socket";

export default function ChatWindow({ conversation }) {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth?.user?._id);

  const conversationId = conversation?._id;
  
  const bottomRef = useRef();

  const { data, isFetching } = useGetMessagesQuery(
    { conversationId, page: 1, limit: 50 },
    { skip: !conversationId }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [text, setText] = useState("");

  // =========================
  // ✅ SOCKET LISTENER
  // =========================
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    const handler = (msg) => {
      if (msg.conversation !== conversationId) return;

      dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          { conversationId, page: 1, limit: 50 },
          (draft) => {
            const exists = draft.data?.some((m) => m._id === msg._id);
            if (!exists) {
              draft.data.push(msg);
            }
          }
        )
      );
    };

    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [conversationId, dispatch]);

  // =========================
  // ✅ CLEAR UNREAD COUNT
  // =========================
  useEffect(() => {
    if (!conversationId || !userId) return;

    dispatch(
      chatApi.util.updateQueryData(
        "getConversations",
        { page: 1, limit: 50 },
        (draft) => {
          const convo = draft.data?.find((c) => c._id === conversationId);
          if (convo && convo.unreadCounts) {
            convo.unreadCounts[userId] = 0;
          }
        }
      )
    );
  }, [conversationId, userId, dispatch]);

  // =========================
  // ✅ AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // =========================
  // ✅ SEND MESSAGE
  // =========================
  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    try {
      await sendMessage({ conversationId, text }).unwrap();
      setText("");
    } catch (e) {
      console.error("Send failed:", e);
    }
  };

  // =========================
  // ❌ NO CONVERSATION SELECTED
  // =========================
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-white sm:justify-center">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="p-3 font-semibold border-b">
        {conversation.car?.title || "Conversation"}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {isFetching && <p>Loading...</p>}

        {data?.data?.map((m) => {
          const isMe = m.sender === userId;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm ${
                  isMe ? "bg-green-200" : "bg-orange-300"
                }`}
              >
                <p className= "text-black">{m.text}</p>
                <p className="mt-1 text-xs text-gray-500 ">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="flex items-center gap-2 p-3 border-t bg-background text-forground">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={isSending}
          className="px-5 py-2 text-white bg-orange-300 rounded-full hover:bg-gray-800 disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}