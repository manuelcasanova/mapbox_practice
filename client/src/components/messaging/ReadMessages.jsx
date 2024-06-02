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
  // console.log("user", user)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([])

  // console.log("auth in Read Messages", auth.userId)

    // console.log("userForMessages in read Messages:", userForMessages)
    // console.log("user id in Read Messages", user.id)

  // console.log("users", users)

  //  console.log("messages in UsersMessagging", messages)

  // console.log("sender", sender, "receiver", receiver)

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchUserMessages(auth, userForMessages, messages, setMessages)

    const interval = setInterval(() => {
      fetchUserMessages(auth, userForMessages, messages, setMessages);
      // console.log("interval, fetchuserMessages")
    }, 10000); // 10 seconds

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
      clearInterval(interval);
    };
  }, [updateMessages]);


// // Render messages
const renderedMessages = messages.map((message) => {
  // console.log("message", message)
  const author = users.find((u) => u.id === message.sender)?.username;

 
  const messageDate = new Date(message.date).toLocaleString('en-GB');
  const messageContent = message.content;


  // const content = `${author} wrote on ${new Date(
  //   message.date
  // ).toLocaleString()}: ${message.content}`;

  const isCurrentUserMessage = message.sender === auth.userId || message.receiver === auth.userId;

  const isCurrentUserSender = message.sender === auth.userId;

  const className = isCurrentUserSender ? "users-messaging-me" : "users-messaging-them";


  // console.log("content", content)

  // console.log("message sender", message.sender)
  // console.log("message receiver", message.receiver)
  // console.log(" userid", user.id)
  // console.log("user for messages in Read Messages.jsx", userForMessages)

  // Check if the sender or receiver matches the logged-in user's ID

  // if (message.sender === user.id || message.receiver === user.id) {
    if (isCurrentUserMessage) {
    return (
      <div key={message.date} className={className}>
        <div className="users-messaging-message-date">{messageDate}</div>
        <div className={isCurrentUserSender ? "users-messaging-message-content message-me" : "users-messaging-message-content message-them"}>{messageContent}</div>
      </div>
    );
  } else {
    // If neither the sender nor receiver matches, don't render the message
    return (null);
  }
});
return (
  <div className="users-messaging-messages">
    {isLoading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error.message}</p>
    ) : (
      renderedMessages
    )}
  </div>
);
}