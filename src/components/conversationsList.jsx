import ConversationItem from "./conversationItem";

function ConversationsList({
  conversations = [],
  onlineUserIds = new Set(),
  activeConversationId,
  setActiveConversationId,
}) {
  return (
    <div>
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.user_id}
            conversation={conversation}
            isActive={activeConversationId === conversation.user_id}
            isOnline={onlineUserIds.has(conversation.user_id)}
            onClick={() => setActiveConversationId(conversation.user_id)}
          />
        ))
      ) : (
        <p className="p-4 text-gray-500 text-center">No conversations yet</p>
      )}
    </div>
  );
}

export default ConversationsList;
