//Libraries, dependencies

import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

//Hooks

import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from "../util_functions/FetchUsername";

//Fontawesome
import { faEnvelope, faBell, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function MessagesNotifications() {
  const axiosPrivate = useAxiosPrivate()
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [messagesNotifications, setMessagesNotifications] = useState([])
  const [showNotificationMessages, setShowNotificationMessages]
    = useState(true);
  const [users, setUsers] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("messages noti", messagesNotifications)
  }, [messagesNotifications])

  // console.log("user", user)
  // console.log("users", users)

  const fetchMessageNotifications = async (auth, setMessagesNotifications, setIsLoading, setError, isMounted) => {


    try {
      const response = await axiosPrivate.get(`${BACKEND}/messages/notifications`, {
        params: {
          user: auth
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
    fetchMessageNotifications(auth, setMessagesNotifications, setIsLoading, setError, isMounted)
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  // Group notifications by sender
  const groupedNotifications = {};
  messagesNotifications.forEach(notification => {
    if (!groupedNotifications[notification.sender]) {
      groupedNotifications[notification.sender] = notification;
    }
  });

  // Convert object back to array
  const uniqueNotifications = Object.values(groupedNotifications);

  return (
    <>
      {/* {auth && messagesNotifications.length > 0 && ( */}
      {auth && uniqueNotifications.length > 0 && (

        <>
          {/* {messagesNotifications.map(notification => { */}
          {uniqueNotifications.map(notification => {
            const senderUser = users.find(user => user.id === notification.sender);
            const senderUsername = senderUser ? senderUser.username : "Unknown";

            const userForMessages = notification.sender;
            // console.log("userFormessages in MessageNotificaitons", userForMessages)

            const dismissNotification = (notificationId) => {
              setMessagesNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== notificationId)
              );
            };
            const handleClick = (sender) => {
              navigate(`/users/messaging/${sender}`, { state: { userForMessages: sender } });
              setMessagesNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.sender !== sender)
              );
            };


            return (


              showNotificationMessages &&
              <div
                className="notifications-container"
                key={notification.id}>
                <div className="notifications-buttons">
                  <button
                    className="orange-button new-email-button"
                    onClick={() => { handleClick(notification.sender); dismissNotification(notification.id) }}>
                    <div className="notifications-new-email-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <FontAwesomeIcon
                        className="faBell-new-email"
                        icon={faBell} />
                    </div>
                    {senderUsername}
                  </button>

                  <button
                    className="red-button"
                    onClick={() => dismissNotification(notification.id)}>
                    <FontAwesomeIcon
                    
                      icon={faCircleXmark} />
                  </button>


                </div>
              </div>
            )


          })}
        </>
      )}
    </>
  );



}




