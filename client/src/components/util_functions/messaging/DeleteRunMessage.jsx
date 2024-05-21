import { useState } from "react";

export default function DeleteRunMessage({ messageId, setMessageDeleted }) {

// console.log("messageId in util func delete run", messageId)
const BACKEND = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND}/runs/message/delete/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setError("");
      setMessageDeleted(prev => !prev);
    }
    catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while deleting the message.');
    }
    
  };

  return (
    <>
      <button onClick={handleDelete}>Delete Message</button>
      {error && <p>{error}</p>}
    </>
  );
}
