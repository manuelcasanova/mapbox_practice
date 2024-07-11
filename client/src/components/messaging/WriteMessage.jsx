// Hooks
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// Context
import useAuth from "../../hooks/useAuth";

export default function WriteMessage({ userForMessages, setUpdateMessages }) {
  // Variables
  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth();
  const sender = auth.userId
  const receiver = userForMessages;
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState()
  const userLoggedIn = auth.userId
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
  }, [sender, receiver, newMessage]);

  const sendMessage = async (e, newMessage, receiver, sender, userLoggedIn) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      await axiosPrivate.post(`${BACKEND}/users/messages/send`, {
        newMessage, receiver, sender, userLoggedIn
      });
      setUpdateMessages(prev => !prev)
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage) {
      alert('Please fill out the message field.');
      return;
    }
    sendMessage(e, newMessage, receiver, sender, userLoggedIn)
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  };

  return (
    <div className="users-messaging-send">
      <input
        placeholder="Aa"
        ref={inputRef}

        onChange={(e) => {
          const inputValue = e.target.value;
          if (inputValue.length < 255) {
            setNewMessage(inputValue);
          }
        }}

        onKeyDown={handleKeyDown}
        value={newMessage}
        required></input>
      <button
        disabled={!newMessage}
        onClick={handleSubmit}
        className="orange-button small-button"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
