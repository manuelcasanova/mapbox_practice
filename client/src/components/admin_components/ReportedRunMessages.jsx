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
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        
<div className="reported-messages-container">
          <div className="users-title">Reported messages</div>
          {reportedRunMessages.length > 0 ? (
            <table className="reported-messages-table">
  <thead>
  <tr>
    <th>Message</th>
    <th>Message by</th>
    <th>Ride</th>
    <th>Reported by</th>
    <th></th>
    <th></th>
  </tr>
</thead>
  <tbody>

  {reportedRunMessages.map((message) => (
                <tr key={message.id}>
                  <td>{message.message}</td>
                  <td>{
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</td>
                  <td>{message.run_id}</td> 
                  <td>{
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</td>
                 <td> <FlagInapropiateRunMessage messageId={message.id} setMessageFlagged={setMessageFlagged}/></td>
                  <td><AdminOkReportedRunMessage messageId={message.id} setMessageReported={setMessageReported}/>        </td>
                  </tr>
              ))}

  </tbody>

          

           </table>
          ) : (
            <p>No reported messages.</p>
          )}
        </div>

      )}
    </>
  );
}
