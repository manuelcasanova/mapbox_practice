import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import fetchReportedMessages from "../util_functions/messaging/FetchReportedMessages";

export default function ReportedNotifications() {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [reportedNotifications, setReportedNotifications] = useState([]);
  const [showNotificationMessages, setShowNotificationMessages] = useState(true);
  const navigate = useNavigate();
  const [reportedMessages, setReportedMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  // console.log("reportedMessages", reportedMessages)
  // console.log("reportedNotifications", reportedNotifications)


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
        const reportedMessages = await fetchReportedMessages({ auth });
        // console.log("reportedMessages", reportedMessages);
        if (isMounted) {
          setReportedMessages(reportedMessages);
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
    fetchReportedNotifications(auth, setReportedNotifications, setIsLoading, setError, isMounted);

    return () => {
      setIsMounted(false); // Cleanup function to handle unmounting
    };
  }, [auth]);

  const fetchReportedNotifications = async (auth, setReportedNotifications, setIsLoading, setError, isMounted) => {
    try {

      if (!auth.isAdmin) {
       
        setIsLoading(false);
        return;
      }


      const response = await axios.get('http://localhost:3500/messages/reportednotifications', {
        params: { user: auth }
      });
      if (isMounted) {
        setReportedNotifications(response.data);
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
    setReportedNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const handleClick = (sender) => {
    navigate(`/rides/messages/reported`);
    setReportedNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.sender !== sender)
    );
  };

  return (
    <>
      {auth.isAdmin && reportedNotifications.length > 0 && (
        <>
          {(
            showNotificationMessages && (
              <div key={reportedNotifications[0].id}>
                <button onClick={() => { handleClick(reportedNotifications[0].sender); dismissNotification(reportedNotifications[0].id) }}>
                  New reported messages
                </button>
                <button onClick={() => dismissNotification(reportedNotifications[0].id)}>Dismiss</button>
              </div>
            )
          )}
        </>
      )}

{/* {auth.isAdmin && reportedNotifications.length === 0 && reportedMessages.length > 0 && (
  <div>
    {console.log("2nd")}
    <button onClick={() => navigate(`/rides/messages/reported`)}>Pending Reported Messages</button>
  </div>
)} */}






    </>
  );
}
