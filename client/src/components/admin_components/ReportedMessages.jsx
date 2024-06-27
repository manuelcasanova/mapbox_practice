// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchReportedMessages from "../util_functions/messaging/FetchReportedMessages";
import FlagInapropiateMessage from "../util_functions/messaging/FlagInappropiateMessage";
import AdminOkReportedMessage from "../util_functions/messaging/AdminOkReportedMessage";
import fetchUsernameAndId from "../util_functions/FetchUsername";

//Styles
import '../../styles/ReportedMessages.css'

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

  if (!auth.isAdmin) {
    return <p>Admin only: Access denied.</p>;
  }

  return (
    <>
      {isLoading ? (
       <div className="loading"></div>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (

        <div className="reported-messages-container">
          <div className="users-title">Reported messages</div>
          {reportedMessages.length > 0 ? (
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
                {reportedMessages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.message}</td>
                    <td>{
                      users.find(user => user.id === message.createdby)?.username || "Unknown User"
                    }</td>
                    <td>{message.ride_id}</td>
                    <td>{
                      users.find(user => user.id === message.reportedby)?.username || "Unknown User"
                    }</td>
                    <td><FlagInapropiateMessage messageId={message.id} setMessageFlagged={setMessageFlagged} /></td>
                    <td><AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported} /></td>
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
