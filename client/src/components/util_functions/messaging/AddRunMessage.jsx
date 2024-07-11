import React, { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function AddRunMessage({ userId, userIsLoggedIn, runId, setMessageSent }) {

  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate();
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
      const response = await axiosPrivate.post(`${BACKEND}/runs/addmessage`, {
        message,
        userId,
        userIsLoggedIn,
        runId
      },

        {
          headers: {
            "Content-Type": "application/json",
          }
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
      setIsLoading(false);
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
        className="add-ride-message-input" ref={inputRef} type="text" value={message} onChange={handleMessageChange} onKeyDown={
          handleKeyDown} />
      <button
        className="orange-button small-button"
        onClick={handleSubmit}
      >Send</button>
      {error && <div>{error}</div>}
    </div>
  );
}
