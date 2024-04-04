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

                //  console.log("user mapped", user)

                  // Check if the current user is being followed by the logged-in user
  const isFollowing = followers.some(follower => 
    follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'accepted'
  );

  const isPendingFollowee = followers.some(follower => 
    follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
  );

  const isFollower = followers.some(follower => 
    follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'accepted'
  );

  const isPendingFollower = followers.some(follower => 
    follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'pending'
  );

                // Render the JSX elements, including the formatted date
                return (


                  <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                    <div>Id: {user.id}</div>  {/* Hide on production */}
                    <div>{user.username}</div>
                    {isFollowing && <div>I am following this user</div>}
                    {isPendingFollowee && <div>Following request pending</div>}
                    {isPendingFollower && <div>Request follow. Accept?</div>}
                    {isFollower && <div>I am being followed by this user</div>}

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
