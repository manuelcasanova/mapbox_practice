import { useEffect, useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"

//Util functions

import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchUsernameAndId from "./util_functions/FetchUsername";
import MuteUserButton from "./util_functions/mute_functions/MuteUserButton";

const MutedUsers = () => {

  const { auth } = useAuth();

  const userLoggedin = auth.userId
  const isLoggedIn = auth.accessToken !== undefined;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [mutedUsers, setMutedUsers] = useState([])


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [userLoggedin]);

  const mutedUserObjects = users.filter(user => mutedUsers.includes(user.id));

  // useEffect(() => {
  //   console.log("mutedUserObjects", mutedUserObjects);
  // }, [mutedUserObjects])

  // console.log("user", user)
  // console.log("loggedInUserId", userLoggedin)
  // console.log("isUserLoggedIn", isLoggedIn)
  // useEffect(() => {
  //   console.log("mutedUsers", mutedUsers)
  // }, [mutedUsers])

  // useEffect(() => {
  //   console.log("users", users)
  // }, [users])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='users-all-container'>
      {!isLoggedIn ? (
        <p>Please log in to see users.</p>
      ) : mutedUserObjects.length === 0 ? (<>
         <div className="users-title">Muted users</div>
       <div>No muted users.</div>
      </>
       
      ) : (
        <div>
          <div className="users-title">Muted users</div>
          {mutedUserObjects.map(user => (
            <div 
            className='users-all-user'
             key={user.id} >
              <div className='users-all-picture'>{user.id}</div>
              <div className='user-details'>
<div className='users-all-name'>{user.username}</div>
</div>
<div className='user-actions'>
              <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default MutedUsers