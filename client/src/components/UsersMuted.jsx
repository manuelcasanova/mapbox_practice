import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";

//Util functions

import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchUsernameAndId from "./util_functions/FetchUsername";
import MuteUserButton from "./util_functions/mute_functions/MuteUserButton";

const MutedUsers = () => {

  const { user } = useAuth();

  const userLoggedin = user.id
  const isLoggedIn = user.loggedIn;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [mutedUsers, setMutedUsers] = useState([])


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
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
    <div>
      {!isLoggedIn ? (
        <p>Please log in to see users.</p>
      ) : mutedUserObjects.length === 0 ? (
        <div>No muted users.</div>
      ) : (
        <div>
          {mutedUserObjects.map(user => (
            <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
              <div>Id: {user.id}</div>
              <div>{user.username}</div>
              <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default MutedUsers