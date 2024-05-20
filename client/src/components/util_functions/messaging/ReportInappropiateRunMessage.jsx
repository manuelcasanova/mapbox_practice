import { useState } from "react";

import useAuth from "../../../hooks/useAuth";

export default function ReportInappropiateRunMessage({ messageId, setMessageReported, user }) {

// console.log("messageId in util func delete run", messageId)

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);




  const handleInappropiate = async () => {
    try {
      setIsLoading(true);   

      const body = JSON.stringify({
        messageId,
        userLoggedInId: user.userId 
      });

      const response = await fetch(`http://localhost:3500/runs/message/report/`, {
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
    <div>
      <button onClick={handleInappropiate} disabled={isLoading}>Report</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}