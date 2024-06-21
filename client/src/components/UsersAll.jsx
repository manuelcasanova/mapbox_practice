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
  //  console.log("auth in Users All", auth)
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const userLoggedin = auth.userId
  const userLoggedInObject = auth
  const usersExceptMe = users.filter(user => user.id !== userLoggedin);
  const isLoggedIn = auth.loggedIn
  const [showFilter, setShowFilter] = useState(false)
  const [showLargePicture, setShowLargePicture] = useState(null)
  const BACKEND = process.env.REACT_APP_API_URL;

  const defaultFilteredUsers = {
    userName: 'all'
  }

  const [filteredUsers, setFilteredUsers] = useState(defaultFilteredUsers);

  // console.log("filtered users", filteredUsers)
  const onFilter = (filters) => {
    setFilteredUsers(filters)
  };

  // console.log("users", users)
  // console.log("followers", followers)
  // console.log("userLoggedin", userLoggedin)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted, filteredUsers)
    fetchFollowee(auth, setFollowers, setIsLoading, setError, isMounted)
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
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

    return !!(followFromLoggedIn && followToLoggedIn); // Convert to boolean
  });

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const allUsersMutedOrMe = usersExceptMe.every(user => mutedUsers.includes(user.id));

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
                <div className="users-title">All users</div>

                {followingEachOther.map((isFollowing, index) => {
                  const user = usersExceptMe[index];
                  const isMuted = mutedUsers.includes(user.id);

                  // console.log("user in usersAll", user)

                  if (!isMuted) {
                    return (
                      <div
                        className='users-all-user'
                        key={user.id}>
                        <div className='users-all-picture-container'
                      
                        >
                          <img   onClick={() => setShowLargePicture(user.id)} className='users-all-picture' src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}  
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

                          {isFollowing &&

                            <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}>  <FontAwesomeIcon icon={faEnvelope} /></button>


                          }

                          <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />



                          <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />

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
