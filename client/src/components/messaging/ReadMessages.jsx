//Hooks
import { useEffect, useState } from "react";

//Util functions
import fetchUserMessages from "../util_functions/messaging/users/FetchUserMessages"


export default function ReadMessages () {

  //Variables
const [messages, setMessages] = useState([])
console.log("messages in readMessage.jsx", messages)

  useEffect(() => {
    let isMounted = true;
   fetchUserMessages(1, 2, messages, setMessages)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, []);


  return (
    <div>Read Messages</div>
  
    
  )
}