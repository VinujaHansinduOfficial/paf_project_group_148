// chat-frontend/components/Inbox.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow } from "date-fns";

const Inbox = ({ userId, onSelectUser }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchChats = () => {
      if (userId) {
        axios
          .get(`http://localhost:8080/messages/recent/${userId}`)
          .then((res) => setRecentChats(res.data))
          .catch((err) => console.error("Failed to fetch recent chats", err));
      }
    };

    fetchChats(); // Initial fetch
    const interval = setInterval(fetchChats, 600); // Refresh every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueUserIds = [
        ...new Set(
          recentChats.map((chat) =>
            chat.senderId === userId ? chat.receiverId : chat.senderId
          )
        ),
      ];

      const usernamePromises = uniqueUserIds.map((id) =>
        axios
          .get(`http://localhost:8080/users/uid/${id}`)
          .then((res) => ({ id, username: res.data.username }))
          .catch((err) => {
            console.error(`Failed to fetch username for user ${id}`, err);
            return { id, username: `User ${id}` }; // Fallback to user ID
          })
      );

      const results = await Promise.all(usernamePromises);
      const usernameMap = results.reduce(
        (acc, { id, username }) => ({ ...acc, [id]: username }),
        {}
      );
      setUsernames(usernameMap);
    };

    if (recentChats.length > 0) {
      fetchUsernames();
    }
  }, [recentChats, userId]);

  return (
    <div className="inbox">
      <h3 style={{ textAlign: "center", flex: 1, marginLeft: "10px" }}>
        Inbox
      </h3>
      <ul>
        {recentChats.map((chat) => {
          const partnerId =
            chat.senderId === userId ? chat.receiverId : chat.senderId;
          const partnerName = usernames[partnerId] || `User ${partnerId}`;
          return (
            <List
              key={chat.id}
              onClick={() => onSelectUser(partnerId)}
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <img
                      src={`profileimg.jpeg`}
                      alt={partnerName}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={partnerName}
                  secondary={
                    <>
                      <div>{chat.message}</div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        {formatDistanceToNow(new Date(chat.timestamp), {
                          addSuffix: true,
                        })}
                      </div>
                    </>
                  }
                />
              </ListItem>
            </List>
          );
        })}
      </ul>
    </div>
  );
};

export default Inbox;
