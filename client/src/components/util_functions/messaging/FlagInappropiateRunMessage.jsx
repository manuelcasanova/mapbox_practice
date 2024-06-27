import { useState } from "react";

import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function FlagInapropiateRunMessage({ messageId, setMessageFlagged }) {

// console.log("messageId in util func delete ride", messageId)

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const BACKEND = process.env.REACT_APP_API_URL;

  const handleInappropiate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND}/runs/message/flag/${messageId}`, {
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
      <button className="red-button small-button" onClick={handleInappropiate}><FontAwesomeIcon icon={faBan} /></button>
      {isLoading && <div className="loading"></div>}
      {error && <p>{error}</p>}
    </div>
  );
}
