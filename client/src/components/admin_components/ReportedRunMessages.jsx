// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchReportedRunMessages from "../util_functions/messaging/FetchReportedRunMessages";
import FlagInapropiateRunMessage from "../util_functions/messaging/FlagInappropiateRunMessage";
import AdminOkReportedRunMessage from "../util_functions/messaging/AdminOkReportedRunMessage";
import fetchUsernameAndId from "../util_functions/FetchUsername";

export default function ReportedRunMessages() {
  // Variables
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedRunMessages, setReportedRunMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)
  const [users, setUsers] = useState([]); 

  // useEffect(() => {
  //   console.log("users", users)
  // }, [users])

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
      isMounted = false; 
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
                  <div>Message By: {
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</div>
                  <div>Ride: {message.run_id}</div> 
                  <div>Message by: {
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</div>
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
