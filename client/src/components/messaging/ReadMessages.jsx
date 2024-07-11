//Hooks
import { useEffect, useState } from "react";

//Context

import useAuth from "../../hooks/useAuth";

//Util functions
import fetchUsernameAndId from "../util_functions/FetchUsername"
import fetchUserMessages from "../util_functions/messaging/users/FetchUserMessages";


export default function ReadMessages({ userForMessages, updateMessages }) {

  //Variables
  const { auth } = useAuth();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([])

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchUserMessages(auth, userForMessages, messages, setMessages)

    const interval = setInterval(() => {
      fetchUserMessages(auth, userForMessages, messages, setMessages);
    }, 3000); // 3 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [updateMessages]);


// // Render messages
const renderedMessages = messages.map((message) => {
  const author = users.find((u) => u.id === message.sender)?.username;

 
  const messageDate = new Date(message.date).toLocaleString('en-GB');
  const messageContent = message.content;

  const isCurrentUserMessage = message.sender === auth.userId || message.receiver === auth.userId;

  const isCurrentUserSender = message.sender === auth.userId;

  const className = isCurrentUserSender ? "users-messaging-me" : "users-messaging-them";

    if (isCurrentUserMessage) {
    return (
      <div key={message.date} className={className}>
        <div className="users-messaging-message-date">{messageDate}</div>
        <div className={isCurrentUserSender ? "users-messaging-message-content message-me" : "users-messaging-message-content message-them"}>{messageContent}</div>
      </div>
    );
  } else {
    return (null);
  }
});
return (
  <div className="users-messaging-messages">
    {isLoading ? (
      <div className="loading"></div>
    ) : error ? (
      <p>Error: {error.message}</p>
    ) : (
      renderedMessages
    )}
  </div>
);
}