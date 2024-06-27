import { useState } from "react";

import useAuth from "../../../hooks/useAuth";

import '../../../styles/RidesMessaging.css'

export default function ReportInappropiateMessage({ messageId, setMessageReported, user }) {

// console.log("messageId in util func delete ride", messageId)

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND = process.env.REACT_APP_API_URL;


  const handleInappropiate = async () => {
    try {
      setIsLoading(true);   

      const body = JSON.stringify({
        messageId,
        userLoggedInId: user.userId 
      });

      const response = await fetch(`${BACKEND}/rides/message/report/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body
      });

      if (!response.ok) {
        throw new Error("Failed to report message");
      }

      setError("");
      setMessageReported(prev => !prev);
    }
    catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while reporting the message.');
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="report-innapropiate-message">
      <button 
      className="orange-button small-button"
      onClick={handleInappropiate} disabled={isLoading}>Report</button>
      {isLoading && <div className="loading"></div>}
      {error && <p>{error}</p>}
    </div>
  );
}
