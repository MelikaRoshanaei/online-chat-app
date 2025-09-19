import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client.js";
import MessageBubble from "./messageBubble.jsx";
import Form from "./form.jsx";
import Input from "./input.jsx";
import Button from "./button.jsx";

function MessagePanel({
  socket,
  otherUserId,
  onNewMessage,
  isOtherUserOnline,
}) {
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!otherUserId) return;

    const fetchOtherUser = async () => {
      try {
        const res = await api.get(`/users/${otherUserId}`);
        setOtherUser(res.data);
      } catch (err) {
        console.error("Failed to load other user:", err.message);
      }
    };

    fetchOtherUser();
  }, [otherUserId]);

  useEffect(() => {
    if (!otherUserId) return;

    const fetchConversation = async () => {
      try {
        const res = await api.get(`/messages/${otherUserId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages: ", err.message);
      }
    };

    fetchConversation();
  }, [otherUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (
        message.sender_id === otherUserId ||
        message.receiver_id === otherUserId
      ) {
        setMessages((prev) => [...prev, message]);
        onNewMessage?.(message);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, otherUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post("/messages", {
        receiver_id: otherUserId,
        content: newMessage.trim(),
      });

      const sentMessage = res.data;

      setMessages((prev) => [...prev, sentMessage]);

      onNewMessage?.(sentMessage);

      socket?.emit("sendMessage", sentMessage);
    } catch (err) {
      console.error("Failed to send message:", err.message);
    } finally {
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {otherUser?.name || "Unknown User"}
          </h2>
          <span className="text-green-500 text-sm mt-0.5">
            {isOtherUserOnline ? "(online)" : ""}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={user.id}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <Form
        onSubmit={handleSendMessage}
        className="flex-row items-center border-t p-3"
      >
        <Input
          type="text"
          id="message-input"
          name="message"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </Form>
    </div>
  );
}

export default MessagePanel;
