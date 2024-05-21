//Hooks
import React, { useState, useEffect } from 'react';
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowee from './util_functions/FetchFollowee';
import MuteUserButton from './util_functions/mute_functions/MuteUserButton';
import FollowUserButton from './util_functions/follow_functions/FollowUserButton';
import ApproveFollowerButton from './util_functions/follow_functions/ApproveFollower';

const Followee = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const userLoggedInObject = auth
  // console.log("user in Users Followee", user.id)

  const userLoggedin = auth.userId

  useEffect(() => {
      // console.log("followers in UsersFollowee", followers)
  })


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchFollowee(auth, setFollowers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth, hasMutedChanges]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const amIFollowingAnybody = followers.some(followee =>
    followee.follower_id === userLoggedin && followee.status === 'accepted'
  );

  return (
    <>
      {!amIFollowingAnybody ? (
        <div>You are not following anybody.</div>
      ) : (
        <>

          {auth.accessToken !== undefined ? (
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

                if (amFollowingThem) {

                  return (

                    <div key={user.id}>

                      <div>Id: {user.id}</div>  {/* Hide on production */}
                      <div>{user.username}</div>

                      {pendingAcceptThem && <ApproveFollowerButton userLoggedInObject={userLoggedInObject} followers={followers} setFollowers={setFollowers} followeeId={user.id} followerId={userLoggedin} user={user} userLoggedin={userLoggedin} />}

                      <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />

                      {amFollowingThem && <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />}

                      {canMessage && <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}>Messages</button>}



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
    </>
  );
};

export default Followee;
