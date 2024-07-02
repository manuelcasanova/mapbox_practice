import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowers from './util_functions/FetchFollowers';
import MuteUserButton from './util_functions/mute_functions/MuteUserButton';
import ApproveFollowerButton from './util_functions/follow_functions/ApproveFollower';
import FollowUserButton from './util_functions/follow_functions/FollowUserButton';
import fetchMutedUsers from './util_functions/FetchMutedUsers';

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Followers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const userLoggedInObject = auth;
  const isLoggedIn = auth.loggedIn
  const [showLargePicture, setShowLargePicture] = useState(null)
  const BACKEND = process.env.REACT_APP_API_URL;
 
  // console.log("user in Users FOllowers", user.id)

  const userLoggedin = auth.userId


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchFollowers(auth, setFollowers, setIsLoading, setError, isMounted)
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
      controller.abort()
    };
  }, [auth, hasMutedChanges, isLoggedIn, userLoggedin]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };


  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const areAnyFollowingMe = followers.some(follower =>
    follower.followee_id === userLoggedin &&
    follower.status === 'accepted' &&
    !mutedUsers.some(mutedUser =>
      (mutedUser.muter === follower.follower_id || mutedUser.mutee === follower.follower_id) &&
      mutedUser.mute
    )
    &&
  users.some(user =>
    user.id === follower.follower_id && user.isactive
  )
  );
  

// console.log("areanyfm", areAnyFollowingMe)

  return (
    <div className='users-all-container'>
      {!areAnyFollowingMe ? (
        <>
        <div className="users-title">Followers</div>
        <div>You don't have followers.</div>
        </>
   
      ) : (
        <>
  <div className="users-title">Followers</div>
          {auth.accessToken !== undefined ? (
            <div>
              {users.map(user => {

const amFollowingThem = followers.some(follower =>
  follower.follower_id === userLoggedin &&
  follower.followee_id === user.id &&
  follower.status === 'accepted' &&
  !mutedUsers.some(mutedUser =>
    (mutedUser.muter === follower.follower_id || mutedUser.mutee === follower.follower_id) &&
    mutedUser.mute
  )
);


                // const pendingAcceptMe = followers.some(follower =>
                //   follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
                // );

                const areFollowingMe = followers.some(follower =>
                  follower.followee_id === userLoggedin &&
                  follower.follower_id === user.id &&
                  follower.status === 'accepted' &&
                  !mutedUsers.some(mutedUser =>
                    (mutedUser.muter === follower.follower_id || mutedUser.mutee === follower.follower_id) &&
                    mutedUser.mute
                  )
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

                    <div 
                    className='users-all-user'
                    key={user.id} >



<div className='users-all-picture-container'
                       
                        >
                          <img   onClick={() => setShowLargePicture(user.id)} className='users-all-picture' src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`} alt={user.username}
                              onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop in case of repeated error
                                e.target.src = ` ${BACKEND}/profile_pictures/user.jpg`; // Default fallback image URL
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
                         src={` ${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}  
                         alt={user.username}
                         onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop in case of repeated error
                          e.target.src = ` ${BACKEND}/profile_pictures/user.jpg`; // Default fallback image URL
                        }}
                         />
                          </div>}
<div className='user-details'>

                    <div className='users-all-name'>{user.username}</div>
                    </div>


                    <div className='user-actions'>
                      {pendingAcceptThem && <ApproveFollowerButton userLoggedInObject={userLoggedInObject} followers={followers} setFollowers={setFollowers} followeeId={user.id} followerId={userLoggedin} user={user} userLoggedin={userLoggedin} />}

                      {canMessage && <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}><FontAwesomeIcon icon={faEnvelope} /></button>}

                     <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />
                   
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

export default Followers;
