import { useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

function MessageInput({ senderId, receiverId, onMessageSent }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("http://localhost:8080/messages/send", {
        senderId,
        receiverId,
        message,
      });
      setMessage("");
      onMessageSent(); // Refresh chat
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="p-2 flex">
      <input
        className="flex-grow border rounded-l px-3 py-2"
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
}

export default MessageInput;
