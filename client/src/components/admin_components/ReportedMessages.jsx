// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchReportedMessages from "../util_functions/messaging/FetchReportedMessages";
import FlagInapropiateMessage from "../util_functions/messaging/FlagInappropiateMessage";
import AdminOkReportedMessage from "../util_functions/messaging/AdminOkReportedMessage";
import fetchUsernameAndId from "../util_functions/FetchUsername";

export default function ReportedMessages() {
  // Variables
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedMessages, setReportedMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)
  const [users, setUsers] = useState([]); 

  // useEffect(() => {
  //   console.log("reportedMessages", reportedMessages)
  // }, [reportedMessages])

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; 
    };
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const reportedMessages = await fetchReportedMessages({auth}); 
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

  if (!auth.isAdmin) {
    return <p>Admin only: Access denied.</p>;
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        
<div>
          <h2>Reported messages</h2>
          {reportedMessages.length > 0 ? (
            <ul>
              {reportedMessages.map((message) => (
                <li key={message.id}>
                  <div>Message: {message.message}</div>
                  <div>Message by: {
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</div>
                  <div>Ride: {message.ride_id}</div>  
                  <div>Reported by: {
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</div>
                  <FlagInapropiateMessage messageId={message.id} setMessageFlagged={setMessageFlagged}/>
                  <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported}/>        
                  </li>
              ))}
            </ul>
          ) : (
            <p>No reported messages.</p>
          )}
        </div>

      )}
    </div>
  );
}