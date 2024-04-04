import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowers from './util_functions/FetchFollowers';

const UsersFollow = () => {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const userLoggedin = user.id
  // console.log("user logged in", userLoggedin)

  useEffect(() => {
    console.log("followers", followers)
  })


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)

    fetchFollowers(user, setFollowers, setIsLoading, setError, isMounted)

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

  // const isFollowing = (followerId, followeeId) => {
  //   return followers.some(follower => {
  //     return follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'accepted';
  //   });
  // };

  // const isFollower = (followerId, followeeId) => {
  //   return followers.some(follower => {
  //     return follower.follower_id === followeeId && follower.followee_id === followerId && follower.status === 'accepted';
  //   });
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {users.length === 0 ? (
        <div>No users available.</div>
      ) : (
        <>
          <button>Following</button> {/*Show if followerId === userloggedin.id and followee_id === user.id*/}
          <button>Followers</button>
          <button>Follow</button>

          <div>Search O</div>

          {user.loggedIn ? (
            <div>
              {users.map(user => {

                // console.log("user mapped", user)

                // Render the JSX elements, including the formatted date
                return (


                  <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                    <div>Id: {user.id}</div>  {/* Hide on production */}
                    <div>{user.username}</div>
                    {/* {user.id !== userLoggedin.id && (
                      <>
                        {isFollowing(userLoggedin.id, user.id) && <button>Following</button>}
                        {isFollower(userLoggedin.id, user.id) && <button>Follower</button>}
                        {!isFollowing(userLoggedin.id, user.id) && !isFollower(userLoggedin.id, user.id) && <button>Follow</button>}
                      </>
                    )} */}
                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see users.</p>
          )}
        </>
      )}
    </div>
  );
};

export default UsersFollow;
