//Hooks
import { useParams } from 'react-router-dom';

//Context

import { useAuth } from "../Context/AuthContext";

//Components

import WriteMessage from "./WriteMessage"
import ReadMessages from "./ReadMessages"

export default function UsersMessaging() {

  const { user } = useAuth();
  const { userId } = useParams();
  const propValue = userId ? userId : null;

  // console.log("propValue", propValue)

  return (
    <>
      {user.loggedIn ? (
        <>
      <div>Users Messaging</div>
      <WriteMessage />
      <ReadMessages userId={userId}/>
      </>
      ) : (
        <p>Please log in to see messages.</p>
      )}
    </>
  )
}

