import React, { useEffect, useState, useRef } from "react";

//Styles
import '../../../styles/RidesMessaging.css'

export default function AddRideMessage({ userId, userIsLoggedIn, rideId, setMessageSent }) {

  const BACKEND = process.env.REACT_APP_API_URL;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      // Display an error message or take appropriate action
      setError('Please enter a message before sending.');
      return; // Exit the function early
    }

    try {
      const response = await fetch(`${BACKEND}/rides/addmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId,
          userIsLoggedIn,
          rideId
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to add message");
      }
      else {
        // Reset message input field and display success message
        setMessage("");
        setError("");
        setMessageSent(prev => !prev)
        // console.log("Message sent successfully!");
        // You might want to show a success message to the user here
      }
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        console.error('Error:', error.message);
        setError('An error occurred while sending the message.');
      }
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
};

const handleMessageChange = (e) => {
  const inputValue = e.target.value;
  if (inputValue.length < 255) {
    setMessage(inputValue);
  }
};
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleSubmit(e);
  }
};

return (
  <div className="add-ride-message-container">
    <textarea 
      placeholder="Aa"
    wrap="soft"
    className="add-ride-message-input"
    ref={inputRef} type="text" value={message} onChange={handleMessageChange} onKeyDown={
      handleKeyDown} />
    <button 
    className="orange-button small-button"
    onClick={handleSubmit}
    >Send</button>
     {error && <div>{error}</div>}
  </div>
);
}
