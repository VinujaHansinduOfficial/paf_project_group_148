import { useEffect, useState, useRef } from "react";
import axios from "axios";

function ChatWindow({ senderId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/messages/history`, {
        params: {
          user1Id: senderId,
          user2Id: receiverId,
          limit: 100,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    if (senderId && receiverId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [senderId, receiverId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 h-[70vh] overflow-y-auto border-b">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 p-2 rounded-lg max-w-xs ${
                msg.senderId === senderId
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-200"
              }`}
            >
              <p>{msg.message}</p>
              <small className="text-gray-600 text-xs block mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
