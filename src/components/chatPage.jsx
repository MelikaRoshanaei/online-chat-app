import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client.js";
import ConversationsList from "./conversationsList";

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
      console.log("Received Online Users:", userIds);
      setOnlineUserIds(new Set(userIds));
    });

    return () => {
      socket.off("updateOnlineUsers");
    };
  }, [socket, user]);

  return (
    <ConversationsList
      conversations={conversations}
      onlineUserIds={onlineUserIds}
      activeConversationId={activeConversationId}
      setActiveConversationId={setActiveConversationId}
    />
  );
}

export default ChatPage;
