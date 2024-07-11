import React, { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

//Styles
import '../../../styles/RidesMessaging.css'

export default function AddRideMessage({ userId, userIsLoggedIn, rideId, setMessageSent }) {

  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      setError('Please enter a message before sending.');
      return;
    }

    try {
      const response = await axiosPrivate.post(`${BACKEND}/rides/addmessage`, {
        message,
        userId,
        userIsLoggedIn,
        rideId
      },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.data) {
        throw new Error("Failed to add message");
      }
      else {
        setMessage("");
        setError("");
        setMessageSent(prev => !prev)
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
