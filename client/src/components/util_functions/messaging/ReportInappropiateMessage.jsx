import { useState } from "react";

export default function ReportInappropiateMessage({ messageId, setMessageReported }) {

// console.log("messageId in util func delete ride", messageId)

  const [error, setError] = useState("");

  const handleInappropiate = async () => {
    try {
      const response = await fetch(`http://localhost:3500/rides/message/report/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
  };

  return (
    <div>
      <button onClick={handleInappropiate}>Report</button>
      {error && <p>{error}</p>}
    </div>
  );
}
