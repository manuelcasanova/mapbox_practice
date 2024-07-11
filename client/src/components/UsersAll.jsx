import React, { useState, useEffect } from 'react';
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowee from './util_functions/FetchFollowee';
import fetchMutedUsers from './util_functions/FetchMutedUsers';
import MuteUserButton from './util_functions/mute_functions/MuteUserButton';
import FollowUserButton from './util_functions/follow_functions/FollowUserButton';
// import ApproveFollowerButton from './util_functions/follow_functions/ApproveFollower';

import { faEnvelope, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/Navbar.css'

//Components
import UsernameFilter from '../components/UsernameFilter'

//Styles

import '../styles/Navbar.css'
import '../styles/Users.css'
import '../styles/UsersButtons.css'

const UsersAll = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const userLoggedin = auth.userId
  const userLoggedInObject = auth
  const usersExceptMe = users.filter(user => user.id !== userLoggedin && user.isactive);
  const isLoggedIn = auth.loggedIn
  const [showFilter, setShowFilter] = useState(false)
  const [showLargePicture, setShowLargePicture] = useState(null)
  const BACKEND = process.env.REACT_APP_API_URL;

  const defaultFilteredUsers = {
    userName: 'all'
  }

  const [filteredUsers, setFilteredUsers] = useState(defaultFilteredUsers);

  const onFilter = (filters) => {
    setFilteredUsers(filters)
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted, filteredUsers)
    fetchFollowee(auth, setFollowers, setIsLoading, setError, isMounted)
    fetchMutedUsers(auth, userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false;
    };
  }, [auth, hasMutedChanges, filteredUsers]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };

  const followingEachOther = usersExceptMe.map(otherUser => {
    const followFromLoggedIn = followers.find(follower =>
      follower.follower_id === userLoggedin &&
      follower.followee_id === otherUser.id &&
      follower.status === 'accepted'
    );

    const followToLoggedIn = followers.find(follower =>
      follower.follower_id === otherUser.id &&
      follower.followee_id === userLoggedin &&
      follower.status === 'accepted'
    );

    return !!(followFromLoggedIn && followToLoggedIn);
  });

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }


  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const userIDsExceptMe = usersExceptMe.map(user => user.id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  return (


    <>
      {!showFilter &&
        <button title="Filter" className='rides-public-filter-ride'
          onClick={() => handleShowFilter()}
        > <FontAwesomeIcon icon={faSliders} /></button>}


      <div className='users-all-container'>



        {showFilter &&
          <UsernameFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
        }
        {allUsersMutedOrMe ? (
          <div>No users available or all users are muted.</div>
        ) : (
          <>

            {auth.accessToken !== undefined ? (
              <div>
                <div className="users-title">All Users</div>

                {followingEachOther.map((isFollowing, index) => {

                  const user = usersExceptMe[index];

                  const isMuted = mutedUsers.some(mute =>
                    (mute.muter === user.id && mute.mutee === userLoggedin) ||
                    (mute.muter === userLoggedin && mute.mutee === user.id)

                  );
                  const isActive = user.isactive

                  if (!isMuted && isActive) {
                    return (
                      <div
                        className='users-all-user'
                        key={user.id}>
                        <div className='users-all-picture-container'

                        >
                          <img onClick={() => setShowLargePicture(user.id)} className='users-all-picture' src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop in case of repeated error
                              e.target.src = `${BACKEND}/profile_pictures/user.jpg`;
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
                              e.target.src = `${BACKEND}/profile_pictures/user.jpg`;
                            }}
                          />
                        </div>}

                        <div className='user-details'>
                          <div className='users-all-name'>{user.username}</div>
                        </div>


                        <div className='user-actions'>

                          {isFollowing &&

                            <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}>  <FontAwesomeIcon icon={faEnvelope} /></button>


                          }

                          <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />



                          <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={isMuted} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />

                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p>Please log in to see users.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UsersAll;
