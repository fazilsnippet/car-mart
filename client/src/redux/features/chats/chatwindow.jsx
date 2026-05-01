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


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useGetMessagesQuery,
//   useSendMessageMutation,
//   chatApi,
// } from "./chatApi";
// import { ArrowLeft, Send } from "lucide-react";
// import { joinConversation } from "../../../utils/socket";

// export default function ChatWindow({
//   conversation,        // optional
//   car,                 // for header
//   onBack,
//   onConversationCreated // 🔥 parent must handle transition
// }) {
//   const dispatch = useDispatch();
//   const userId = useSelector((state) => state.auth?.user?._id);

//   const conversationId = conversation?._id;
//   const isIntentMode = !conversationId;
// const carId =
//   car?._id ||
//   conversation?.car?._id ||
//   conversation?.car;
//   const bottomRef = useRef();

//   const [localMessages, setLocalMessages] = useState([]);
//   const [text, setText] = useState("");

//   const { data, isFetching } = useGetMessagesQuery(
//     { conversationId },
//     { skip: !conversationId }
//   );

//   const [sendMessage, { isLoading: isSending }] =
//     useSendMessageMutation();

//   // ✅ messages source
//   const messages = isIntentMode
//     ? localMessages
//     : [...(data?.data || [])].sort(
//         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//       );

//   // =========================
//   // 🔌 SOCKET (only real chat)
//   // =========================
//   useEffect(() => {
//     if (!conversationId) return;

//     const socket = joinConversation(conversationId);
//     if (!socket) return;

//     const handler = (message) => {
//       if (message.conversation !== conversationId) return;

//       const senderId =
//         typeof message.sender === "object"
//           ? message.sender._id
//           : message.sender;

//       if (senderId === userId) return;

//       dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId },
//           (draft) => {
//             if (!draft.data) draft.data = [];

//             const exists = draft.data.some((m) => m._id === message._id);
//             if (!exists) draft.data.push(message);
//           }
//         )
//       );
//     };

//     socket.on("newMessage", handler);
//     return () => socket.off("newMessage", handler);
//   }, [conversationId, dispatch, userId]);

//   // =========================
//   // 📜 AUTO SCROLL
//   // =========================
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // =========================
//   // 💬 SEND MESSAGE
//   // =========================
//   const handleSend = async () => {
//     if (!text.trim()) return;

//     const tempId = `temp-${Date.now()}`;
//     const tempMessage = {
//       _id: tempId,
//       text,
//       sender: { _id: userId },
//       createdAt: new Date().toISOString(),
//     };

//     // =========================
//     // 🆕 INTENT MODE
//     // =========================
//     if (isIntentMode) {
//       // show immediately
//       setLocalMessages((prev) => [...prev, tempMessage]);

//       try {
//         const res = await sendMessage({
//           text,
//           // carId: car?._id,
//           userId,
//           carId
//         }).unwrap();

//         const { conversationId: newId } = res.data;

//         // 🔥 notify parent to switch mode
//         onConversationCreated?.(newId);

//       } catch (err) {
//         // rollback UI
//         setLocalMessages((prev) =>
//           prev.filter((m) => m._id !== tempId)
//         );
//       }

//       setText("");
//       return;
//     }

//     // =========================
//     // 🔁 EXISTING CHAT
//     // =========================
//     await sendMessage({
//       conversationId,
//       text,
//       userId,
//       carId
      
//     });

//     setText("");
//   };

//   // =========================
//   // 🧱 UI
//   // =========================
//   return (
//     <div className="flex flex-col h-full bg-gray-50">

//       {/* HEADER */}
//       <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
//         <button
//           onClick={onBack}
//           className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-gray-100 md:hidden"
//         >
//           <ArrowLeft size={18} />
//         </button>

//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-semibold text-gray-800 truncate">
//             {conversation?.car?.title || car?.title || "New Chat"}
//           </p>
//           <p className="text-xs text-gray-400">
//             {isIntentMode ? "Start conversation" : "Active conversation"}
//           </p>
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
//         {isFetching && !isIntentMode && (
//           <p className="text-sm text-gray-400">Loading messages...</p>
//         )}

//         {messages.map((m) => {
//           const isMe =
//             typeof m.sender === "object"
//               ? m.sender._id === userId
//               : m.sender === userId;

//           return (
//             <div
//               key={m._id}
//               className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`
//                   max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
//                   ${
//                     isMe
//                       ? "bg-indigo-600 text-white rounded-br-md"
//                       : "bg-white text-gray-800 border rounded-bl-md"
//                   }
//                 `}
//               >
//                 <p>{m.text}</p>

//                 <p
//                   className={`mt-1 text-[10px] ${
//                     isMe ? "text-white/70" : "text-gray-400"
//                   }`}
//                 >
//                   {new Date(m.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             </div>
//           );
//         })}

//         <div ref={bottomRef} />
//       </div>

//       {/* INPUT */}
//       <div className="p-3 bg-white border-t">
//         <div className="flex items-center gap-2 px-3 py-2 border rounded-full shadow-sm bg-gray-50">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 text-sm bg-transparent outline-none"
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />

//           <button
//             onClick={handleSend}
//             disabled={isSending}
//             className="p-2 text-white transition bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50"
//           >
//             <Send size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  chatApi,
} from "./chatApi";
import { ArrowLeft, Send } from "lucide-react";
import { joinConversation } from "../../../utils/socket";

export default function ChatWindow({
  conversation,
  car,
  onBack,
  onConversationCreated,
}) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?._id);

  const conversationId = conversation?._id;
  const carId = car?._id || conversation?.car?._id || conversation?.car;

  const bottomRef = useRef();
  const [text, setText] = useState("");

  // =========================
  // 📡 FETCH MESSAGES
  // =========================
  const { data, isFetching } = useGetMessagesQuery(
    { conversationId },
    { skip: !conversationId }
  );

  const [sendMessage, { isLoading: isSending }] =
    useSendMessageMutation();

  const messages = conversationId
    ? [...(data?.data || [])].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    : [];

  // =========================
  // 🔌 SOCKET LISTENER
  // =========================
  useEffect(() => {
    if (!conversationId) return;

    const socket = joinConversation(conversationId);
    if (!socket) return;

    const handler = (message) => {
      if (message.conversation !== conversationId) return;

      const senderId =
        typeof message.sender === "object"
          ? message.sender._id
          : message.sender;

      // ❌ ignore own message (already handled optimistically)
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

    return () => {
      socket.off("newMessage", handler);
    };
  }, [conversationId, dispatch, userId]);

  // =========================
  // 📜 AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 💬 SEND MESSAGE
  // =========================
  const handleSend = async () => {
    if (!text.trim()) return;

    const currentText = text;
    setText("");

    try {
      const res = await sendMessage({
        text: currentText,
        conversationId,
        carId,
      }).unwrap();

      // 🆕 FIRST MESSAGE → SWITCH CHAT
      if (res.conversation) {
        onConversationCreated?.(res.conversation._id);
      }
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // =========================
  // 🧱 UI
  // =========================
  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-full w-9 h-9 hover:bg-gray-100 md:hidden"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {conversation?.car?.title || car?.title || "Support Chat"}
          </p>
          <p className="text-xs text-gray-400">
            {conversationId ? "Active conversation" : "Start conversation"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {isFetching && !conversationId && (
          <p className="text-sm text-gray-400">Loading...</p>
        )}

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
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 border rounded-bl-md"
                }`}
              >
                <p>{m.text}</p>

                <p
                  className={`mt-1 text-[10px] ${
                    isMe ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-full shadow-sm bg-gray-50">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm bg-transparent outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={isSending}
            className="p-2 text-white transition bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}