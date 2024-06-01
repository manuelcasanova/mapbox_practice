// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchFlaggedRunMessages from "../util_functions/messaging/FetchFlaggedRunMessages";
import AdminOkReportedRunMessage from "../util_functions/messaging/AdminOkReportedRunMessage";
import fetchUsernameAndId from "../util_functions/FetchUsername";

export default function FlaggedMessages() {
  // Variables
  const BACKEND = process.env.REACT_APP_API_URL;
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
        const flaggedMessages = await fetchFlaggedRunMessages({auth}); 
        //  console.log("flaggedMessages", flaggedMessages);
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
        
<div className="reported-messages-container">
          <div className="users-title">Flagged messages</div>
          {flaggedMessages.length > 0 ? (
            <table className="reported-messages-table">
         
         <thead>
  <tr>
    <th>Message</th>
    <th>Message by</th>
    <th>Run</th>
    <th>Reported by</th>
    <th></th>
    <th></th>
  </tr>
</thead>
  <tbody>

              {flaggedMessages.map((message) => (
                <tr key={message.id}>
                  <td>{message.message}</td>
                  <td>{
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</td>
                  <td>{message.run_id}</td>  
                  <td>{
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</td>
                  <td><AdminOkReportedRunMessage messageId={message.id} setMessageReported={setMessageReported}/>        
                  </td>
                  </tr>
              ))}
          </tbody>
            </table>
          ) : (
            <p>No flagged messages.</p>
          )}
        </div>

      )}
    </>
  );
}
