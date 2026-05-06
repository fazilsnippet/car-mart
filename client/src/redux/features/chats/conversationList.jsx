// src/features/chat/ConversationList.jsx
import React from "react";
import { useGetConversationsQuery } from "./chatApi";

export default function ConversationList({ onSelectConversation, selectedId }) {
  const { data, isLoading, refetch } = useGetConversationsQuery({
    page: 1,
    limit: 50,
  });

  const userId = localStorage.getItem("userId");

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-3 bg-gray-200 rounded" />
              <div className="w-3/4 h-3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const conversations = data?.data || [];

  return (
    <div className="flex flex-col h-full bg-background text-foreground">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-color bg-background text-foreground">
        <h2 className="text-base font-semibold text-foreground">
          Conversations
        </h2>

        <button
          onClick={refetch}
          className="text-sm text-indigo-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* EMPTY STATE */}
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-sm text-foreground">
          No conversations yet
        </div>
      ) : (

        /* LIST */
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const other = conv.participants?.find(
              (p) => p._id !== userId
            );

            const unread =
              conv.unreadCounts?.[userId] || 0;

            const isActive = selectedId === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full text-left px-4 py-3 flex gap-3 items-start transition
                  ${isActive ? "bg-indigo-50" : "hover:bg-gray-500"}
                `}
              >
                {/* AVATAR */}
                <div className="flex items-center justify-center text-sm font-semibold text-gray-600 rounded-full w-11 h-11 bg-foreground text-foreground shrink-0">
                  {other?.name?.[0] || "U"}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {conv.car?.title || other?.name || "Conversation"}
                    </p>

                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage?.text || "No messages yet"}
                    </p>

                    {unread > 0 && (
                      <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}