// Hooks
import { useEffect, useState } from "react";

// Context
import useAuth from "../../hooks/useAuth";

// Util functions
import fetchReportedMessages from "../util_functions/messaging/FetchReportedMessages";

export default function ReportedMessages() {
  // Variables
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportedMessages, setReportedMessages] = useState([]);

  useEffect(() => {
    console.log("reportedMessages", reportedMessages)
  }, [reportedMessages])

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const reportedMessages = await fetchReportedMessages(); 
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
  }, []); // Removed updateMessages dependency as it wasn't defined

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
                  <div>Message by: {message.createdby  }</div>
                  <div>Ride: {message.ride_id}</div>          
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
