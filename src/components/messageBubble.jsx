function MessageBubble({ message, currentUserId }) {
  const isSentByCurrentUser = message.sender_id === currentUserId;
  const formattedDate = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const baseStyle = "p-3 rounded-lg text-sm max-w-[80%] sm:max-w-md";
  const currentUserStyle = "bg-blue-500 text-white ml-auto";
  const otherUserStyle = "bg-gray-200 text-gray-800 mr-auto";
  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`${baseStyle} ${
          isSentByCurrentUser ? currentUserStyle : otherUserStyle
        }`}
      >
        <div className="text-xs font-medium mb-1 truncate">
          {isSentByCurrentUser ? "You" : message.sender_name}
        </div>
        <div className="break-words">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isSentByCurrentUser ? "text-blue-200" : "text-gray-500"
          }`}
        >
          {formattedDate}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
