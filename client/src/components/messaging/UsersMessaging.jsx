//Hooks

import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

//Components

import WriteMessage from "./WriteMessage";
import ReadMessage from "./ReadMessages.jsx"

export default function UsersMessaging() {
  const { user } = useAuth();
  const { state } = useLocation();
  const userForMessages = state?.userForMessages; // Access userForMessages from state

  console.log("userForMessages", userForMessages);
  console.log("user.id", user.id)

  return (
    <>
      {user.loggedIn ? (
        <>
          <div>Users Messaging</div>
         <WriteMessage />
         <ReadMessage userForMessages={userForMessages}/>
        </>
      ) : (
        <p>Please log in to see messages.</p>
      )}
    </>
  );
}
