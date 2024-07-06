import { useState } from "react";


import useAxiosPrivate from "../../../hooks/useAxiosPrivate"; 

export default function DeleteRunMessage({ messageId, setMessageDeleted }) {

// console.log("messageId in util func delete run", messageId)
const BACKEND = process.env.REACT_APP_API_URL;
const axiosPrivate = useAxiosPrivate();

  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axiosPrivate.post(`${BACKEND}/runs/message/delete/${messageId}`, {},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data) {
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
    <div className="delete-ride-message-container">
      <button 
      className="red-button small-button"
      onClick={handleDelete}>Delete Message</button>
      {error && <p>{error}</p>}
    </div>
  );
}
