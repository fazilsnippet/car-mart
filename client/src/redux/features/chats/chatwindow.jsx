// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useGetMessagesQuery,
//   useSendMessageMutation,
//   chatApi,
// } from "./chatApi";
// import { joinConversation } from "../../../utils/socket";

// export default function ChatWindow({ conversation }) {
//   const dispatch = useDispatch();

//   const userId = useSelector((state) => state.auth?.user?._id);

//   const conversationId = conversation?._id;
  
//   const bottomRef = useRef();

//   const { data, isFetching } = useGetMessagesQuery(
//     { conversationId, page: 1, limit: 50 },
//     { skip: !conversationId }
//   );

//   const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
//   const [text, setText] = useState("");

//   // =========================
//   // ✅ SOCKET LISTENER
//   // =========================
//   useEffect(() => {
//     const socket = joinConversation(conversationId);
//     if (!socket || !conversationId) return;
// const messages = [...(data?.data || [])].sort(
//   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// );
// const handler = ({ message }) => {
//         if (message.conversation !== conversationId) return;

//       dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId, page: 1, limit: 50 },
//           (draft) => {
//             const exists = draft.data?.some((m) => m._id === message._id);
//             if (!exists) {
//               if (!draft.data) draft.data = [];
// draft.data.push(message);
//             }
            
//           }
//         )
//       );
//     };

//     socket.on("newMessage", handler);

//     return () => socket.off("newMessage", handler);
//   }, [conversationId, dispatch]);

//   // =========================
//   // ✅ CLEAR UNREAD COUNT
//   // =========================
//   useEffect(() => {
//     if (!conversationId || !userId) return;

//     dispatch(
//       chatApi.util.updateQueryData(
//         "getConversations",
//         { page: 1, limit: 50 },
//         (draft) => {
//           const convo = draft.data?.find((c) => c._id === conversationId);
//           if (convo && convo.unreadCounts) {
//             convo.unreadCounts[userId] = 0;
//           }
//         }
//       )
//     );
//   }, [conversationId, userId, dispatch]);

//   // =========================
//   // ✅ AUTO SCROLL
//   // =========================
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [data]);

//   // =========================
//   // ✅ SEND MESSAGE
//   // =========================
//   const handleSend = async () => {
//     if (!text.trim() || !conversationId) return;

//     try {
//       await sendMessage({ conversationId, text, userId }).unwrap();
//       setText("");
//     } catch (e) {
//       console.error("Send failed:", e);
//     }
//   };

//   // =========================
//   // ❌ NO CONVERSATION SELECTED
//   // =========================
//   if (!conversation) {
//     return (
//       <div className="flex items-center justify-center h-full text-white sm:justify-center">
//         Select a conversation
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">

//       {/* HEADER */}
//       <div className="p-3 font-semibold border-b">
//         {conversation.car?.title || "Conversation"}
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 p-3 space-y-2 overflow-y-auto">
//         {isFetching && <p>Loading...</p>}

//         {messages.map((m) => {
//           const isMe =
//   typeof m.sender === "object"
//     ? m.sender._id === userId
//     : m.sender === userId;

//           return (
//             <div
//               key={m._id}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[70%] p-2 rounded-lg text-sm ${
//                   isMe ? "bg-green-200" : "bg-orange-300"
//                 }`}
//               >
//                 <p className= "text-black">{m.text}</p>
//                 <p className="mt-1 text-xs text-gray-500 ">
//                   {new Date(m.createdAt).toLocaleTimeString()}
//                 </p>
//               </div>
//             </div>
//           );
//         })}

//         <div ref={bottomRef} />
//       </div>

//       {/* INPUT BAR */}
//       <div className="flex items-center gap-2 p-3 border-t bg-background text-forground">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSend();
//           }}
//         />

//         <button
//           onClick={handleSend}
//           disabled={isSending}
//           className="px-5 py-2 text-white bg-orange-300 rounded-full hover:bg-gray-800 disabled:opacity-50"
//         >
//           {isSending ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  chatApi,
} from "./chatApi";
import { joinConversation } from "../../../utils/socket";

export default function ChatWindow({ conversation }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?._id);
  const conversationId = conversation?._id;
  const bottomRef = useRef();

  const { data, isFetching } = useGetMessagesQuery(
    { conversationId },
    { skip: !conversationId }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [text, setText] = useState("");

  // =========================
  // ✅ SORT (ASC → bottom latest)
  // =========================
  const messages = [...(data?.data || [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // =========================
  // ✅ SOCKET LISTENER
  // =========================
  useEffect(() => {
    const socket = joinConversation(conversationId);
    if (!socket || !conversationId) return;

    const handler = ({ message }) => {
      if (message.conversation !== conversationId) return;

      // ❌ ignore own messages (avoid duplicates)
      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      if (senderId === userId) return;

      dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          { conversationId },
          (draft) => {
            if (!draft.data) draft.data = [];

            const exists = draft.data.some(
              (m) => m._id === message._id
            );

            if (!exists) {
              draft.data.push(message);
            }
          }
        )
      );
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [conversationId, dispatch, userId]);

  // =========================
  // ✅ AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // ✅ SEND MESSAGE
  // =========================
  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    try {
      await sendMessage({ conversationId, text, userId }).unwrap();
      setText("");
    } catch (e) {
      console.error("Send failed:", e);
    }
  };

  if (!conversation) {
    return <div>Select a conversation</div>;
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

        {messages.map((m) => {
          const isMe =
            typeof m.sender === "object"
              ? m.sender._id === userId
              : m.sender === userId;

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
                <p className="text-black">{m.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 p-3 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={isSending}
          className="px-5 py-2 text-white bg-orange-400 rounded-full"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}