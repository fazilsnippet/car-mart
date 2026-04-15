// src/features/chat/ConversationList.jsx
import React from "react";
import { useGetConversationsQuery } from "./chatApi";

export default function ConversationList({ onSelectConversation, selectedId }) {
  const { data, isLoading, refetch } = useGetConversationsQuery({ page: 1, limit: 50 });

  if (isLoading) return <div>Loading conversations…</div>;

  return (
    <div className="conversation-list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Conversations</h3>
        <button onClick={() => refetch()}>Refresh</button>
      </div>

      {data?.data?.length === 0 && <div>No conversations yet</div>}

      <ul>
        {data?.data?.map((conv) => {
          const other = conv.participants?.find((p) => p._id !== localStorage.getItem("userId"));
          const unread = conv.unreadCounts?.[localStorage.getItem("userId")] || 0;
          return (
            <li
              key={conv._id}
              onClick={() => onSelectConversation(conv)}
              style={{
                padding: 12,
                borderBottom: "1px solid #eee",
                background: selectedId === conv._id ? "#f5f7ff" : "transparent",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{conv.car?.title || other?.name || "Conversation"}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {conv.lastMessage?.text?.slice(0, 80) || "No messages yet"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12 }}>{new Date(conv.updatedAt).toLocaleString()}</div>
                  {unread > 0 && <div style={{ background: "#e33", color: "#fff", borderRadius: 12, padding: "2px 8px", fontSize: 12 }}>{unread}</div>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
