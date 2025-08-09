function ConversationItem({ conversation, isActive, isOnline, onClick }) {
  const { user_name, last_message, last_message_timestamp } = conversation;

  const formattedDate = new Date(last_message_timestamp).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  const baseStyle = "p-3 flex justify-between items-center cursor-pointer";
  const activeStyle = isActive
    ? "bg-blue-100 border-t border-b border-blue-500"
    : "bg-white hover:bg-gray-50";

  return (
    <div className={`${baseStyle} ${activeStyle}`} onClick={onClick}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {user_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span
          className={`absolute bottom-0.5 -right-0.5 w-3 h-3 border-white rounded-full ${
            isOnline ? "bg-green-500 visible" : "bg-transparent invisible"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium pl-3 text-gray-900 truncate">
          {user_name}
        </div>
        <div className="text-sm pl-3 text-gray-500 truncate">
          {last_message}
        </div>
      </div>
      <div className="text-xs text-gray-400">{formattedDate}</div>
    </div>
  );
}

export default ConversationItem;
