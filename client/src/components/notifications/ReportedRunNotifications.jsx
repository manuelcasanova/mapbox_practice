import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import fetchReportedRunMessages from "../util_functions/messaging/FetchReportedRunMessages";

export default function ReportedRunNotifications() {
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
        // console.log("reportedMessages", reportedMessages);
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


      const response = await axios.get('http://localhost:3500/messages/reportedrunnotifications', {
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
    navigate(`/rides/messages/reported`);
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
              <div key={reportedRunNotifications[0].id}>
                <button onClick={() => { handleClick(reportedRunNotifications[0].sender); dismissNotification(reportedRunNotifications[0].id) }}>
                  New reported messages
                </button>
                <button onClick={() => dismissNotification(reportedRunNotifications[0].id)}>Dismiss</button>
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