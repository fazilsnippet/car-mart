// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import { useGetConversationsQuery } from "./chatApi";
// import ChatWindow from "./chatwindow.jsx";


// export default function ChatPage() {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();

//   const { data, isLoading } = useGetConversationsQuery();
//   const conversations = data?.data || [];

//   return (
// <div className="flex h-[calc(100vh-60px)]">

//   <div className="p-2 ">
//     <button
//         onClick={() => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       navigate("/chat");
//     }
//   }}
//       className="p-2 rounded-full hover:bg-gray-200 block md:hidden"
//     >
//       <ArrowLeft />
//     </button>

//       <button
//       onClick={() => navigate(-1)}
//       className="p-2 rounded-full hover:bg-gray-200 hidden md:block"
//     >
//       <ArrowLeft />
//     </button>
//   </div>

//   {/* LEFT SIDEBAR */}
//   <div className="hidden w-1/3 overflow-y-auto border-r md:block">
//     <h2 className="p-4 font-semibold">Conversations</h2>

//     {isLoading ? (
//       <p className="p-4 text-gray-500">Loading...</p>
//     ) : conversations.length === 0 ? (
//       <p className="p-4 text-gray-500">No conversations</p>
//     ) : (
//       conversations.map((conv) => (
//         <div
//           key={conv._id}
//           onClick={() => navigate(`/chat/${conv._id}`)}
//           className={`p-4 cursor-pointer hover:bg-gray-400 ${
//             conversationId === conv._id ? "bg-gray-500" : ""
//           }`}
//         >
//           <p className="font-medium">
//             {conv.car?.title || "Car Chat"}
//           </p>

//           <p className="text-sm truncate text-foreground">
//             {conv.lastMessage?.text || "No messages yet"}
//           </p>
//         </div>
//       ))
//     )}
//   </div>

//       {/* RIGHT */}
//       <div className="flex flex-col flex-1">
// <ChatWindow
//   conversation={conversations.find(c => c._id === conversationId)}
// />      </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import ConversationList from "./conversationList";
import ChatWindow from "./chatwindow";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="h-dvh bg-gray-50 flex">

      {/* LEFT PANEL */}
      <div
        className={`
          w-full md:w-[35%] lg:w-[30%]
          border-r border-gray-200
          bg-white
          flex flex-col
          transition-all duration-300
          ${selectedConversation ? "hidden md:flex" : "flex"}
        `}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
          Messages
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedId={selectedConversation?._id}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`
          w-full md:flex-1
          flex flex-col
          bg-white
          transition-all duration-300
          ${!selectedConversation ? "hidden md:flex" : "flex"}
        `}
      >
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            
            {/* EMPTY STATE */}
            <div className="max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                💬
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                Your messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a conversation to start chatting with sellers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}