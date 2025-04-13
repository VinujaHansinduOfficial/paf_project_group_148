// chat-frontend/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Inbox from "../components/Inbox";
import "./ChatPage.css";

const ChatPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`http://localhost:8080/messages/history`, {
          params: {
            user1Id: user.id,
            user2Id: selectedUserId,
            limit: 50,
          },
        })
        .then((res) => setChatMessages(res.data))
        .catch((err) => console.error("Failed to fetch messages", err));
    } else {
      setChatMessages([]);
    }
  }, [selectedUserId, user.id]);

  const handleSendMessage = () => {
    if (!newMessage || !selectedUserId) return;

    axios
      .post(`http://localhost:8080/messages/send`, {
        senderId: user.id,
        receiverId: selectedUserId,
        message: newMessage,
      })
      .then(() => {
        setNewMessage("");
        return axios.get(`http://localhost:8080/messages/history`, {
          params: {
            user1Id: user.id,
            user2Id: selectedUserId,
            limit: 50,
          },
        });
      })
      .then((res) => setChatMessages(res.data))
      .catch((err) => console.error("Failed to send message", err));
  };

  return (
    <div className="chat-container">
      <Inbox userId={user.id} onSelectUser={setSelectedUserId} />

      <div className="chat-window">
        {selectedUserId ? (
          <>
            <h3>Chat with User {selectedUserId}</h3>
            <div className="messages">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.senderId === user.id ? "message me" : "message other"
                  }
                >
                  <div className="text">{msg.message}</div>
                  <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <p>Select a user from the inbox to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
