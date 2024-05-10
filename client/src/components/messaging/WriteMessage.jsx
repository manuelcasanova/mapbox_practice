// Hooks
import { useEffect, useState } from "react";
import axios from 'axios';

// Context
import useAuth from "../../hooks/useAuth";

export default function WriteMessage({ userForMessages, setUpdateMessages }) {
  // Variables
  const { auth } = useAuth();
  const sender = auth.userId
  const receiver = userForMessages;
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState()
  const userLoggedIn = auth.userId
  const [isLoading, setIsLoading] = useState(false)

  // console.log(isLoggedIn)


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
      await axios.post(`http://localhost:3500/users/messages/send`, {
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

  // Return JSX
  return (
    <>
      <input
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        required></input>
      <button
        disabled={!newMessage}
        onClick={(e) => {
          if (!newMessage) {
            alert('Please fill out the message field.'); // Inform user that message field is required
            return;
          }
          sendMessage(e, newMessage, receiver, sender, userLoggedIn)
          setNewMessage("")
        }
        }

      >
        
        {isLoading ? "Sending..." : "Send"} {/* Show "Sending..." when loading */}
      </button>
      {error && <p>{error}</p>}
    </>
  );
}
