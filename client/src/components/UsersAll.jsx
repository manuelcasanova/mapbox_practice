import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowee from './util_functions/FetchFollowee';

const UsersAll = () => {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();



  const userLoggedin = user.id

  const usersExceptMe = users.filter(user => user.id !== userLoggedin);

  useEffect(() => {
    console.log("followers", followers)
  })


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
              {usersExceptMe.map(user => {

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
         

                  return (

                    <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                      <div>Id: {user.id}</div>  {/* Hide on production */}
                      <div>{user.username}</div>
                      
                     

                      {amFollowingThem && !areFollowingMe && <div>Following</div>}
                      {amFollowingThem && areFollowingMe && <div>Following</div>}


                      {pendingAcceptThem && <div>Accept them</div>}

                      {!amFollowingThem && areFollowingMe && <div>Follow back</div>}
                      {!amFollowingThem && !areFollowingMe && <div>Follow</div>}

                      {isMuted && <div>Unmute</div>}
                      {!isMuted && <div>Mute</div>}
                

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

export default UsersAll;