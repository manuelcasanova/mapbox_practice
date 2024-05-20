import React, { useEffect, useState, useRef } from "react";

export default function AddRunMessage({ userId, userIsLoggedIn, runId, setMessageSent }) {

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
      const response = await fetch('http://localhost:3500/runs/addmessage', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId,
          userIsLoggedIn,
          runId
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
  setMessage(e.target.value);
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleSubmit(e);
  }
};

return (
  <div>
    <input ref={inputRef} type="text" value={message} onChange={handleMessageChange} onKeyDown={
      handleKeyDown} />
    <button 
    onClick={handleSubmit}
    >Send</button>
     {error && <div>{error}</div>}
  </div>
);
}