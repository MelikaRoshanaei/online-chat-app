import { useState, useEffect } from "react";
import ConversationsList from "./conversationsList";

function ChatPage({ socket }) {
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    socket.on("updateOnlineUsers", (userIds) => {
      console.log("Received Online Users:", userIds);
      setOnlineUserIds(new Set(userIds));
    });

    return () => {
      socket.off("updateOnlineUsers");
    };
  }, [socket]);

  return (
    <ConversationsList
      conversations={[]} // Placeholder until axios is integrated
      onlineUserIds={onlineUserIds}
      activeConversationId={activeConversationId}
      setActiveConversationId={setActiveConversationId}
    />
  );
}

export default ChatPage;
