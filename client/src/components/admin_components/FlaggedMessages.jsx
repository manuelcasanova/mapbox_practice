// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchFlaggedMessages from "../util_functions/messaging/FetchFlaggedMessages";
import AdminOkReportedMessage from "../util_functions/messaging/AdminOkReportedMessage";
import fetchUsernameAndId from "../util_functions/FetchUsername";

export default function FlaggedMessages() {
  // Variables
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)
  const [users, setUsers] = useState([]); 

  // useEffect(() => {
  //   console.log("flaggedMessages", flaggedMessages)
  // }, [flaggedMessages])

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
        const flaggedMessages = await fetchFlaggedMessages({auth}); 
        // console.log("flaggedMessages", flaggedMessages);
        if (isMounted) {
          setFlaggedMessages(flaggedMessages);
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
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        
<div>
          <h2>Flagged messages</h2>
          {flaggedMessages.length > 0 ? (
            <ul>
              {flaggedMessages.map((message) => (
                <li key={message.id}>
                  <div>Message: {message.message}</div>
                  <div>Message by: {
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</div>
                  <div>Ride: {message.ride_id}</div>  
                  <div>Reported by: {
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</div>
                  <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported}/>        
                  </li>
              ))}
            </ul>
          ) : (
            <p>No flagged messages.</p>
          )}
        </div>

      )}
    </>
  );
}
