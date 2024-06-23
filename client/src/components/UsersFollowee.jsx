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

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Followee = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLargePicture, setShowLargePicture] = useState(null)
  const { auth } = useAuth();
  const userLoggedInObject = auth
  // console.log("user in Users Followee", user.id)
  const BACKEND = process.env.REACT_APP_API_URL;

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
    <div className='users-all-container'>
      {!amIFollowingAnybody ? (
        <>
         <div className="users-title">Following</div>
        <div>You are not following anybody.</div>
        </>
      ) : (
        <>

          {auth.accessToken !== undefined ? (
            <div>
              <div className="users-title">Following</div>
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

                    <div 
                    className='users-all-user'
                    key={user.id}>
{console.log(user.id)}

<div className='users-all-picture-container'
                        
                        >
                          <img onClick={() => setShowLargePicture(user.id)} className='users-all-picture' src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}  
                              onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop in case of repeated error
                                e.target.src = `${BACKEND}/profile_pictures/user.jpg`; // Default fallback image URL
                              }}
                          />
                        </div>


                        {showLargePicture === user.id && <div
                        className='large-picture'
                        onClick={() => setShowLargePicture(null)}
                        >
                         <img 
                         className='users-all-picture-large'
                         onClick={() => setShowLargePicture(null)}
                         src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}  
                         onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop in case of repeated error
                          e.target.src = `${BACKEND}/profile_pictures/user.jpg`; // Default fallback image URL
                        }}
                         />
                          </div>}
<div className='user-details'>
<div className='users-all-name'>{user.username}</div>
</div>


<div className='user-actions'>
         
{pendingAcceptThem && <ApproveFollowerButton userLoggedInObject={userLoggedInObject} followers={followers} setFollowers={setFollowers} followeeId={user.id} followerId={userLoggedin} user={user} userLoggedin={userLoggedin} />}

                      {canMessage && <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}><FontAwesomeIcon icon={faEnvelope} /></button>}
               

                      {amFollowingThem && <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />}


                      <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />


</div>
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
