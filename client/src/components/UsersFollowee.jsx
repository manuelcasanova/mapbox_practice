import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowee from './util_functions/FetchFollowee';

const Followee = () => {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const userLoggedin = user.id

  // useEffect(() => {
  //   console.log("followers", followers)
  // })


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    fetchFollowee(user, setFollowers, setIsLoading, setError, isMounted)
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

          {user.loggedIn ? (
            <div>
              {users.map(user => {

                const amFollowingThem = followers.some(follower =>
                  follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'accepted'
                );

                const pendingAcceptMe = followers.some(follower =>
                  follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
                );

                const areFollowingMe = followers.some(follower =>
                  follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'accepted'
                );

                const pendingAcceptThem = followers.some(follower =>
                  follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'pending'
                );

                const isMuted = followers.some(follower =>
                  follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.mute === true
                );

                if (amFollowingThem) {

                  return (

                    <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                      <div>Id: {user.id}</div>  {/* Hide on production */}
                      <div>{user.username}</div>

                      {pendingAcceptThem && <button>Approve follower</button>}


                      {isMuted && <button>Unmute</button>}
                      {!isMuted && <button>Mute</button>}

                      {amFollowingThem && <button>Unfollow</button>}

                    </div>
                  );
                } else {
                  return null
                }

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

export default Followee;
