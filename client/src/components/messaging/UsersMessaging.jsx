//Hooks

import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

//Components

import WriteMessage from "./WriteMessage";
import ReadMessage from "./ReadMessages.jsx"
import { useEffect, useState } from "react";

//Util functions

import fetchUsernameAndId from "../util_functions/FetchUsername.jsx";

export default function UsersMessaging() {
  const { auth } = useAuth();
  const { state } = useLocation();
  const userForMessages = state?.userForMessages; // Access userForMessages from state
  const [updateMessages, setUpdateMessages] = useState(false)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showLargePicture, setShowLargePicture] = useState(null)

  // console.log("user", user)
  //  console.log("userForMessages", userForMessages);
  // console.log("user.id", user.id)

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  useEffect(() => {
    // console.log("users in user messaging", users)
  }, [updateMessages, users])

   // Extracting username based on userForMessages
   const selectedUser = users.find(u => u.id === userForMessages);
   const selectedUsername = selectedUser ? selectedUser.username : '';


  return (
    <>
      {auth ? (
        <div className="users-messaging-container">

{selectedUser && <>
  <div className='users-messaging-picture-container'
                        
                        >
                          <img 
                          onClick={() => setShowLargePicture(selectedUser.id)}
                          className='users-messaging-picture' src={`http://localhost:3500/profile_pictures/${selectedUser.id}/profile_picture.jpg`}  />
                        </div>


                        {showLargePicture === selectedUser.id && <div
                        className='large-picture'
                        onClick={() => setShowLargePicture(null)}
                        >
                         <img 
                         className='users-all-picture-large'
                         onClick={() => setShowLargePicture(null)}
                         src={`http://localhost:3500/profile_pictures/${selectedUser.id}/profile_picture.jpg`}  
                         onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop in case of repeated error
                          e.target.src = `http://localhost:3500/profile_pictures/user.jpg`; // Default fallback image URL
                        }}
                         />
                          </div>}


</>}
        

          <div className="users-messaging-user">Chat with {selectedUsername}</div>
          <WriteMessage userForMessages={userForMessages} setUpdateMessages={setUpdateMessages} />
          <ReadMessage userForMessages={userForMessages} updateMessages={updateMessages} />
          
        </div>
      ) : (
        <p>Please log in to see messages.</p>
      )}
    </>
  );
}
