import { useState } from "react";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminOkReportedMessage({ messageId, setMessageReported }) {

// console.log("messageId in util func delete ride", messageId)
const BACKEND = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInappropiate = async () => {
    try {
      setIsLoading(true); 
      const response = await fetch(`${BACKEND}/rides/message/ok/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to ok message");
      }

      setError("");
      setMessageReported(prev => !prev);
    }
    catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while okying the message.');
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <>
      <button className="green-button" onClick={handleInappropiate}>   <FontAwesomeIcon icon={faCheck} /></button>
      {error && <p>{error}</p>}
    </>
  );
}
