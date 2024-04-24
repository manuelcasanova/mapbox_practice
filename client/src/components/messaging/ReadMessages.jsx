//Hooks
import { useEffect, useState } from "react";

//Context

import { useAuth } from "../Context/AuthContext";

//Util functions
import fetchUsernameAndId from "../util_functions/FetchUsername"
import fetchUserMessages from "../util_functions/messaging/users/FetchUserMessages";


export default function ReadMessages({ userId }) {

  //Variables
  const { user } = useAuth();
  // console.log("user", user)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([])
  const sender = user.id;
  const receiver = userId;
  //  console.log("user,", user)

  // console.log("users", users)

  //  console.log("messages in UsersMessagging", messages)

  // console.log("sender", sender, "receiver", receiver)

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    fetchUserMessages(user, sender, receiver, messages, setMessages)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, []);


// Render messages
const renderedMessages = messages.map((message) => {
  // console.log("message", message)
  const author = users.find((u) => u.id === message.sender)?.username;
  const content = `${author} wrote on ${new Date(
    message.date
  ).toLocaleString()}: ${message.content}`;

  const isCurrentUserMessage = message.sender === user.id || message.receiver === user.id;

  console.log("content", content)

  console.log("message sender", message.sender)
  console.log("message receiver", message.receiver)
  console.log(" userid", user.id)

  // Check if the sender or receiver matches the logged-in user's ID

console.log(message.sender === user.id)
console.log(message.receiver === user.id)

  // if (message.sender === user.id || message.receiver === user.id) {
    if (isCurrentUserMessage) {
    return (
      <div key={message.id}>
        <p>{content}</p>
      </div>
    );
  } else {
    // If neither the sender nor receiver matches, don't render the message
    return (null);
  }
});
return (
  <div>
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