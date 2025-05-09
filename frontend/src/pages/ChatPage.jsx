/* eslint-disable jsx-a11y/alt-text */
// chat-frontend/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext"; // Import useAuth
import axios from "axios";
import Inbox from "../components/Inbox";
import "./ChatPage.css";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";

const ChatPage = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Fetch username when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`http://localhost:8080/users/uid/${selectedUserId}`)
        .then((res) => setSelectedUsername(res.data.username))
        .catch((err) => console.error("Failed to fetch username", err));
    } else {
      setSelectedUsername("");
    }
  }, [selectedUserId]);

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

  useEffect(() => {
    let interval;
    if (selectedUserId && !newMessage) {
      interval = setInterval(() => {
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
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedUserId, user.id, newMessage]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

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

  const handleDeleteLastMessage = () => {
    const lastMessage = chatMessages
      .filter((msg) => msg.senderId === user.id)
      .pop();

    if (!lastMessage) return;

    axios
      .delete(`http://localhost:8080/messages/delete/${lastMessage.id}`)
      .then(() => {
        setChatMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== lastMessage.id)
        );
      })
      .catch((err) => console.error("Failed to delete message", err));
  };

  const handleUpdateMessage = (messageId, updatedMessage) => {
    if (!updatedMessage) return;

    axios
      .put(`http://localhost:8080/messages/update`, {
        messageId: messageId,
        newMessage: updatedMessage,
      })
      .then(() => {
        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, message: updatedMessage } : msg
          )
        );
      })
      .catch((err) => console.error("Failed to update message", err));
  };

  return (
    <div className="chat-container">
      <Inbox userId={user.id} onSelectUser={setSelectedUserId} />

      <div className="chat-window">
        {selectedUserId ? (
          <>
            <div
              className="chat-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ListItemAvatar>
                <Avatar sx={{ width: 56, height: 56 }}>
                  <img
                    src={`profileimg.jpeg`}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Avatar>
              </ListItemAvatar>
              <h2 style={{ textAlign: "center", flex: 1, marginLeft: "10px" }}>
                {selectedUsername}
              </h2>
            </div>
            <div className="messages">
              {chatMessages.map((msg, index) => (
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
                  {index === chatMessages.length - 1 &&
                    msg.senderId === user.id && (
                      <div className="icon-button-container">
                        <IconButton
                          ref={anchorRef}
                          id="composition-button"
                          aria-controls={open ? "composition-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={handleToggle}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Popper
                          open={open}
                          anchorEl={anchorRef.current}
                          role={undefined}
                          placement="bottom-start"
                          transition
                          disablePortal
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                transformOrigin:
                                  placement === "bottom-start"
                                    ? "left top"
                                    : "left bottom",
                              }}
                            >
                              <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                  <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                  >
                                    <MenuItem onClick={handleDeleteLastMessage}>
                                      Delete
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        const lastMessage = chatMessages
                                          .filter(
                                            (msg) => msg.senderId === user.id
                                          )
                                          .pop();
                                        if (lastMessage) {
                                          const updatedMessage = prompt(
                                            "Enter the updated message:",
                                            lastMessage.message
                                          );
                                          if (updatedMessage !== null) {
                                            handleUpdateMessage(
                                              lastMessage.id,
                                              updatedMessage
                                            );
                                          }
                                        }
                                      }}
                                    >
                                      Update
                                    </MenuItem>
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </div>
                    )}
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
              >
                Send
              </Button>
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
