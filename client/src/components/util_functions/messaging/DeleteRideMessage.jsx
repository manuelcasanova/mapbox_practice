import { useState } from "react";

import '../../../styles/RidesMessaging.css'

export default function DeleteRideMessage({ messageId, setMessageDeleted }) {

// console.log("messageId in util func delete ride", messageId)
const BACKEND = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND}/rides/message/delete/${messageId}`, {
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
    // here??
  };

  return (
    <div className="delete-ride-message-container">
      <button 
      className="red-button small-button"
      onClick={handleDelete}>Delete Message</button>
      {error && <p>{error}</p>}
    </div>
  );
}
