//Libraries, dependencies

import axios from "axios";

//Hooks

import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from "../util_functions/FetchUsername";

export default function MessagesNotifications () {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [messagesNotifications, setMessagesNotifications] = useState(false)
  const [users, setUsers] = useState([])
  const navigate = useNavigate();

    // console.log("user", user)
  // console.log("users", users)

  const fetchMessageNotifications = async (user, setMessagesNotifications, setIsLoading, setError, isMounted) => {


    try {
      const response = await axios.get('http://localhost:3500/messages/notifications', {
        params: {
          user: user 
        }
    
      });
      if (isMounted) {
        // console.log("response.data", response.data)
        setMessagesNotifications(response.data);
          // console.log("message notifications in jsx", response.data)
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error)
        } else {
          setError(error.message)
        }
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchMessageNotifications(user, setMessagesNotifications, setIsLoading, setError, isMounted)
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

  return (
    <>
      {user.loggedIn && messagesNotifications.length > 0 && (
        <>
          {messagesNotifications.map(notification => {
            const senderUser = users.find(user => user.id === notification.sender);
            const senderUsername = senderUser ? senderUser.username : "Unknown";
  
const userForMessages = notification.sender;
// console.log("userFormessages in MessageNotificaitons", userForMessages)

const dismissNotification = (notificationId) => {
  setMessagesNotifications(prevNotifications =>
    prevNotifications.filter(notification => notification.id !== notificationId)
  );
};

            return (

<div key={notification.id}>
<button onClick={() => { navigate(`/users/messaging/${notification.sender}`, { state: { userForMessages: notification.sender } }) }}>Notification new messages from {senderUsername}</button>
<button onClick={() => dismissNotification(notification.id)}>Dismiss</button>
</div>

            );
          })}
        </>
      )}
    </>
  );
  
  

}




