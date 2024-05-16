import { useState } from "react";

export default function FlagInapropiateRunMessage({ messageId, setMessageFlagged }) {

// console.log("messageId in util func delete ride", messageId)

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleInappropiate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3500/runs/message/flag/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to flag message");
      }

      setError("");
      setMessageFlagged(prev => !prev);
    }
    catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while flagging the message.');
    }  finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
  };

  return (
    <div>
      <button onClick={handleInappropiate}>Inappropiate</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
