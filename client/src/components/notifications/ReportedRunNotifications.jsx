import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import fetchReportedRunMessages from "../util_functions/messaging/FetchReportedRunMessages";

//Fontawesome
import { faCircleXmark, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReportedRunNotifications() {
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [reportedRunNotifications, setReportedRunNotifications] = useState([]);
  const [showNotificationMessages, setShowNotificationMessages] = useState(true);
  const navigate = useNavigate();
  const [reportedMessages, setReportedRunMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  // console.log("reportedMessages", reportedMessages)
  // console.log("reportedRunNotifications", reportedRunNotifications)


  // useEffect(() => {
  //   console.log("reportedMessages", reportedMessages)
  // }, [reportedMessages])

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {

        if (!auth.isAdmin) {
       
          setIsLoading(false);
          return;
        }

        
        setIsLoading(true);
        const reportedMessages = await fetchReportedRunMessages({ auth });
        //  console.log("reportedMessages", reportedMessages);
        if (isMounted) {
          setReportedRunMessages(reportedMessages);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [messageFlagged, messageReported]);

  // console.log("auth", auth)

  useEffect(() => {
    let isMounted = true;
    setIsMounted(true);
    fetchReportedRunNotifications(auth, setReportedRunNotifications, setIsLoading, setError, isMounted);

    return () => {
      setIsMounted(false); // Cleanup function to handle unmounting
    };
  }, [auth]);

  const fetchReportedRunNotifications = async (auth, setReportedRunNotifications, setIsLoading, setError, isMounted) => {
    try {

      if (!auth.isAdmin) {
       
        setIsLoading(false);
        return;
      }


      const response = await axios.get(`${BACKEND}/messages/reportedrunnotifications`, {
        params: { user: auth }
      });
      if (isMounted) {
        setReportedRunNotifications(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        setError(error.response ? error.response.data.error : error.message);
        setIsLoading(false);
      }
    }
  };

  const dismissNotification = (notificationId) => {
    setReportedRunNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const handleClick = (sender) => {
    navigate(`/runs/messages/reported`);
    setReportedRunNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.sender !== sender)
    );
  };

  return (
    <>
      {auth.isAdmin && reportedRunNotifications.length > 0 && (
        <>
          {(
            showNotificationMessages && (
              <div className="notifications-container" key={reportedRunNotifications[0].id}>
                  <div className="notifications-buttons">
                <button 
                className="orange-button"
                onClick={() => { handleClick(reportedRunNotifications[0].sender); dismissNotification(reportedRunNotifications[0].id) }}>
        <FontAwesomeIcon 
          className="faBell-follow-request"
          icon={faBell} />
         New reported messages
          </button>
                <button 
                className="red-button"
                onClick={() => dismissNotification(reportedRunNotifications[0].id)}><FontAwesomeIcon icon={faCircleXmark} /></button>
                </div>  
              </div>
            )
          )}
        </>
      )}

{/* {auth.isAdmin && reportedRunNotifications.length === 0 && reportedMessages.length > 0 && (
  <div>
    {console.log("2nd")}
    <button onClick={() => navigate(`/rides/messages/reported`)}>Pending Reported Messages</button>
  </div>
)} */}






    </>
  );
}
