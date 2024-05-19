// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchReportedRunMessages from "../util_functions/messaging/FetchReportedRunMessages";
import FlagInapropiateRunMessage from "../util_functions/messaging/FlagInappropiateRunMessage";
import AdminOkReportedRunMessage from "../util_functions/messaging/AdminOkReportedRunMessage";

export default function ReportedRunMessages() {
  // Variables
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedRunMessages, setReportedRunMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  // useEffect(() => {
  //   console.log("reportedRunMessages", reportedRunMessages)
  // }, [reportedRunMessages])

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const reportedRunMessages = await fetchReportedRunMessages({auth}); 
        // console.log("reportedRunMessages", reportedRunMessages);
        if (isMounted) {
          setReportedRunMessages(reportedRunMessages);
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
          {reportedRunMessages.length > 0 ? (
            <ul>
              {reportedRunMessages.map((message) => (
                <li key={message.id}>
                  <div>Message: {message.message}</div>
                  <div>Message by: {message.createdby  }</div>
                  <div>Ride: {message.ride_id}</div>  
                  <FlagInapropiateRunMessage messageId={message.id} setMessageFlagged={setMessageFlagged}/>
                  <AdminOkReportedRunMessage messageId={message.id} setMessageReported={setMessageReported}/>        
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
