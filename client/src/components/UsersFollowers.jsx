import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowers from './util_functions/FetchFollowers';
import MuteUserButton from './util_functions/mute_functions/MuteUserButton';
import ApproveFollowerButton from './util_functions/follow_functions/ApproveFollower';
import FollowUserButton from './util_functions/follow_functions/FollowUserButton';

const Followers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const userLoggedInObject = user;

  const userLoggedin = user.id

  useEffect(() => {
    //  console.log("followers", followers)
  })


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    fetchFollowers(user, setFollowers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user, hasMutedChanges]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const areAnyFollowingMe = followers.some(follower =>
    follower.followee_id === userLoggedin && follower.status === 'accepted'
  );

// console.log("areanyfm", areAnyFollowingMe)

  return (
    <div>
      {!areAnyFollowingMe ? (
        <div>You don't have followers.</div>
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


                // Check if both users are following each other and they are not muted
            const canMessage = amFollowingThem && areFollowingMe && !isMuted;

                if (areFollowingMe) {

                  return (

                    <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                      <div>Id: {user.id}</div>  {/* Hide on production */}
                      <div>{user.username}</div>

                      {pendingAcceptThem && <ApproveFollowerButton userLoggedInObject={userLoggedInObject} followers={followers} setFollowers={setFollowers} followeeId={user.id} followerId={userLoggedin} user={user} userLoggedin={userLoggedin} />}

                     <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />
                   
                      <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />

                     {canMessage && <button onClick={() => { navigate(`/users/messaging/${user.id}`, { userId: user.id }) }}>Messages</button>}

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

export default Followers;
