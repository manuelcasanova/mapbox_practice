import React, { useEffect, useState } from "react";

export default function AddRideMessage({userId, userIsLoggedIn, rideId, setMessageSent}) {

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      // Display an error message or take appropriate action
      setError('Please enter a message before sending.');
      return; // Exit the function early
    }

    try {
      const response = await fetch('http://localhost:3500/rides/addmessage', {
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
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
