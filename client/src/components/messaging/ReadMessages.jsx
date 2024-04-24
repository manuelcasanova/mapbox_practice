//Hooks
import { useEffect, useState } from "react";

//Context

import { useAuth } from "../Context/AuthContext";

//Util functions
import fetchUsernameAndId from "../util_functions/FetchUsername"
import fetchUserMessages from "../util_functions/messaging/users/FetchUserMessages";



export default function ReadMessages () {

    //Variables
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]); 
  const [messages, setMessages] = useState([])
  const sender = user.id;
  const receiver = user.id;
// console.log("user,", user)

// console.log("users", users)

console.log("messages in UsersMessagging", messages)


  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    fetchUserMessages(sender, receiver, messages, setMessages)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, []);


  return (
    <div>Read Messages</div>
  
    
  )
}