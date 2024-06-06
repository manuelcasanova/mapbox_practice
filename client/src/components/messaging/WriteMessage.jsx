// Hooks
import { useEffect, useState, useRef } from "react";
import axios from 'axios';

// Context
import useAuth from "../../hooks/useAuth";

export default function WriteMessage({ userForMessages, setUpdateMessages }) {
  // Variables
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();
  const sender = auth.userId
  const receiver = userForMessages;
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState()
  const userLoggedIn = auth.userId
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null);
  // console.log(isLoggedIn)

  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // console.log(`From ${sender} to ${receiver}`);
    // console.log("new message", newMessage)
  }, [sender, receiver, newMessage]);

  //Function to add user to ride
  const sendMessage = async (e, newMessage, receiver, sender, userLoggedIn) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      // console.log("Sending message...");
      await axios.post(`${BACKEND}/users/messages/send`, {
        newMessage, receiver, sender, userLoggedIn
      });
      setUpdateMessages(prev => !prev)
      // console.log("Message sent");
      setError(null) //HERE????
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
      alert('Please fill out the message field.'); // Inform user that message field is required
      return;
    }
    sendMessage(e, newMessage, receiver, sender, userLoggedIn)
    setNewMessage("");
  };
  


const handleKeyDown = (e) => {
  // console.log("enter")
  if (e.key === 'Enter') {
  handleSubmit(e)
  }
};




  // Return JSX
  return (
    <div className="users-messaging-send">
      <input
      placeholder="Aa"
          ref={inputRef}
        onChange={(e) => setNewMessage(e.target.value)}
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



// return (
//   <div>
//     <input type="text" value={message} onChange={handleMessageChange} onKeyDown={
//       handleKeyDown} />
//     <button 
//     onClick={handleSubmit}
//     >Send</button>
//      {error && <div>{error}</div>}
//   </div>
// );
// }
