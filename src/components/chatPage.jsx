import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client.js";
import ConversationsList from "./conversationsList";
import MessagePanel from "./messagePanel.jsx";

function ChatPage({ socket }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages");
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("updateOnlineUsers", (userIds) => {
      setOnlineUserIds(new Set(userIds));
    });

    return () => socket.off("updateOnlineUsers");
  }, [socket, user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <ConversationsList
          conversations={conversations}
          onlineUserIds={onlineUserIds}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <MessagePanel socket={socket} otherUserId={activeConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
