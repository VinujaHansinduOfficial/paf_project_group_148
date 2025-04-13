// chat-frontend/components/Inbox.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Inbox = ({ userId, onSelectUser }) => {
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/messages/recent/${userId}`)
        .then((res) => setRecentChats(res.data))
        .catch((err) => console.error("Failed to fetch recent chats", err));
    }
  }, [userId]);

  return (
    <div className="inbox">
      <h3>Inbox</h3>
      <ul>
        {recentChats.map((chat) => {
          const partnerId =
            chat.senderId === userId ? chat.receiverId : chat.senderId;
          return (
            <li key={chat.id} onClick={() => onSelectUser(partnerId)}>
              Chat with User {partnerId}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Inbox;
