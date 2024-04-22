import { useState } from "react";

export default function FlagInapropiateMessage({ messageId, setMessageFlagged }) {

// console.log("messageId in util func delete ride", messageId)

  const [error, setError] = useState("");

  const handleInappropiate = async () => {
    try {
      const response = await fetch(`http://localhost:3500/rides/message/flag/${messageId}`, {
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
    }
  };

  return (
    <div>
      <button onClick={handleInappropiate}>Inappropiate</button>
      {error && <p>{error}</p>}
    </div>
  );
}
