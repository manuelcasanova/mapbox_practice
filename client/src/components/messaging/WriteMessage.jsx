// Hooks
import { useEffect, useState } from "react";

// Context
import { useAuth } from "../Context/AuthContext";

export default function WriteMessage({ userForMessages }) {
  // Variables
  const { user } = useAuth();
  const sender = user.id;
  const receiver = userForMessages;
  const [newMessage, setNewMessage] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    // console.log(`From ${sender} to ${receiver}`);
    console.log("new message", newMessage)
  }, [sender, receiver, newMessage]);

  //Function to add user to ride
  const sendMessage = async (e, sender, receiver) => {
    e.preventDefault();
    try {
        console.log("Sending message...");
      // await axios.post(`http://localhost:3500/rides/adduser`, {
      //   userId, userIsLoggedIn, rideId, isPrivate
      // });
      // // console.log("Successfully added to ride.");
      // toggleAddToMyRides(index); // Toggle state for the clicked ride
      console.log("Message sent");
       setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
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
        onClick={(e) => sendMessage(e, receiver, sender)}
      >Send</button>
    </>
  );
}
