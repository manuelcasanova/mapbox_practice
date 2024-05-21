import { useState } from "react";

export default function AdminOkReportedRunMessage({ messageId, setMessageReported }) {

// console.log("messageId in util func delete ride", messageId)
const BACKEND = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInappropiate = async () => {
    try {
      setIsLoading(true); 
      const response = await fetch(`${BACKEND}/runs/message/ok/${messageId}`, {
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
    <div>
      <button onClick={handleInappropiate}>Approve message</button>
      {error && <p>{error}</p>}
    </div>
  );
}
