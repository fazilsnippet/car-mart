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
//       className="block p-2 rounded-full hover:bg-gray-200 md:hidden"
//     >
//       <ArrowLeft />
//     </button>

//       <button
//       onClick={() => navigate(-1)}
//       className="hidden p-2 rounded-full hover:bg-gray-200 md:block"
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

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationList from "./conversationList";
import ChatWindow from "./chatwindow";

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const intentCar = location.state?.carSnapshot || null;

  const [selectedConversation, setSelectedConversation] = useState(null);

  const isIntentMode = !!intentCar;
  const isChatMode = !!selectedConversation || isIntentMode;

  // =========================
  // HANDLE FIRST MESSAGE SUCCESS
  // =========================
  const handleConversationCreated = (conversationId) => {
    setSelectedConversation({
      _id: conversationId,
      car: intentCar,
    });

    // clear intent after conversion
    navigate("/chat", { replace: true });
  };

  // =========================
  // BACK HANDLER
  // =========================
  const handleBack = () => {
    if (selectedConversation) {
      setSelectedConversation(null);
    } else if (isIntentMode) {
      navigate("/chat", { replace: true });
    }
  };

  return (
    <div className="flex h-dvh bg-background text-foreground">

      {/* =========================
          LEFT PANEL
      ========================= */}
      <div
        className={`
          w-full md:w-[35%] lg:w-[30%]
          border-r border-gray-200
          bg-background
          flex flex-col
          ${isChatMode ? "hidden md:flex" : "flex"}
        `}
      >
        <div className="p-4 font-semibold border-b">
          Messages
        </div>

        <div className="flex-1 overflow-y-auto">
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedId={selectedConversation?._id}
          />
        </div>
      </div>

      {/* =========================
          RIGHT PANEL
      ========================= */}
      <div
        className={`
          w-full md:flex-1
          flex flex-col
          bg-background
          ${!isChatMode ? "hidden md:flex" : "flex"}
        `}
      >

        {/* =========================
            CHAT WINDOW
        ========================= */}
        {isChatMode && (
          <ChatWindow
            conversation={selectedConversation}
            car={intentCar}
            onBack={handleBack}
            onConversationCreated={handleConversationCreated}
          />
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!isChatMode && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-2xl">💬</div>
              <h2 className="font-semibold">Your messages</h2>
              <p className="text-sm text-gray-500">
                Select a chat to start
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}