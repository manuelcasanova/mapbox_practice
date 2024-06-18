import { useEffect, useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import axios from 'axios';

//Util functions

import fetchUsernameAndId from "./util_functions/FetchUsername";
import fetchPendingUsers from "./util_functions/FetchPendingUsers";
import fetchLoginHistory from "./util_functions/FetchLoginHistory";
import fetchIsNewRequest from "./util_functions/follow_functions/FetchIsNewRequest";

const PendingUsers = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();

  const userLoggedin = auth.userId
  const userLoggedInObject = auth;
  const isLoggedIn = auth.accessToken !== undefined;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [fake, setFake] = useState(true)
  const [newRequest, setNewRequest] = useState(false)
  const currentDate = new Date();
  const [loginhistory, setLoginHistory] = useState([]);
  const [showLargePicture, setShowLargePicture] = useState(null)

// console.log("user in UsersPening", user)
// console.log("userLoggedin", userLoggedin)
// console.log("userLoggedinObject", userLoggedInObject)
  

  // console.log("users", users)
  // console.log("pend front", pendingUsers)
  //  console.log("current date", currentDate)

  // Function to approve pending users

  const approveFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axios.post(`${BACKEND}/users/approvefollower`, data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = pendingUsers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...pendingUsers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setPendingUsers(updatedFollowers);
        } else {
          setPendingUsers(prevFollowers => [...prevFollowers, newFollower]);
          setFake(prev => !prev)
        }
      })
      .catch(error => {
        console.error('Error approving follower:', error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  const dismissFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId, //para saber el followee
      followerId: followerId, //para saber el follower
      user: userLoggedInObject //para saber si esta loggedin
    };

    axios.post(`${BACKEND}/users/dismissfollower`, data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = pendingUsers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...pendingUsers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setPendingUsers(updatedFollowers);
        } else {
          setPendingUsers(prevFollowers => [...prevFollowers, newFollower]);
          setFake(prev => !prev)
        }
      })
      .catch(error => {
        console.error('Error dismissing follower:', error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  const dismissMessageFollowRequest = (followeeId, followerId) => {
    
    if (Object.keys(auth).length !== 0) {
    const data = {
      followeeId: followeeId, //para saber el followee
      followerId: followerId, //para saber el follower
      user: userLoggedInObject //para saber si esta loggedin
    };

    axios.post(`${BACKEND}/users/dismissmessagefollowrequest`, data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = pendingUsers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...pendingUsers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setPendingUsers(updatedFollowers);
        } else {
          setPendingUsers(prevFollowers => [...prevFollowers, newFollower]);
          setFake(prev => !prev)
        }
      })
      .catch(error => {
        console.error('Error dismissing message:', error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false regardless of success or failure
      });
    } else {
      console.error("Login to access this area.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchPendingUsers(auth, userLoggedin, isLoggedIn, setPendingUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchLoginHistory(auth, setLoginHistory, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [fake]);

  useEffect(() => {
    // console.log("lh", loginhistory)
  }, [loginhistory])

  const pendingUsersObject = users
  .filter(user => {
      const pendingUser = pendingUsers.find(pUser => pUser.follower_id === user.id);
      return pendingUser; 
  })
  .map(user => ({
      ...user,
      follower_id: pendingUsers.find(pUser => pUser.follower_id === user.id).follower_id,
      lastmodification: new Date(pendingUsers.find(pUser => pUser.follower_id === user.id).lastmodification).getTime(), // Convert to timestamp
  }))
  .sort((a, b) => {
      // Sort by lastmodification (it comes like that from backend, but changes due to map)
      return b.lastmodification - a.lastmodification;
  });

  // console.log("pendingUsersObject", pendingUsersObject)
  
  // Sort the login history array by login time in descending order
loginhistory.sort((a, b) => new Date(b.login_time) - new Date(a.login_time));

const isNewRequest = fetchIsNewRequest(pendingUsersObject, loginhistory);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='users-all-container'>
      {!isLoggedIn ? (
        <p>Please log in to see users.</p>
      ) : pendingUsersObject.length === 0 ? (
        <>
          <div className="users-title">Follow requests pending</div>
        
        <div>No requests pending.</div>
        </>
      ) : (
        <div>
           <div className="users-title">Follow requests pending</div>
          {pendingUsersObject.map(user => (


            <div 
            className='users-all-user'
            key={user.id} >




<div className="users-pending-request-user-wrapper">




<div className="users-pending-user">
<div className='users-all-picture-container'
                        onClick={() => setShowLargePicture(user.id)}
                        >
                          <img className='users-all-picture' src={`http://localhost:3500/profile_pictures/${user.id}/profile_picture.jpg`}  />
                        </div>


                        {showLargePicture === user.id && <div
                        className='large-picture'
                        onClick={() => setShowLargePicture(null)}
                        >
                         <img 
                         className='users-all-picture-large'
                         onClick={() => setShowLargePicture(null)}
                         src={`http://localhost:3500/profile_pictures/${user.id}/profile_picture.jpg`}  />
                          </div>}
              <div className='user-details'>
              <div className='users-all-name'>{user.username}</div>
              </div>
              </div>

</div>


              <div className='user-actions'>
              <button onClick={() => { approveFollower(user.id, userLoggedin) }}>Accept request</button>
              <button onClick={() => { dismissFollower(user.id, userLoggedin) }}>Dismiss</button>
</div>


{<div className="users-pending-request-made">Request made {
              Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) < 1
              ? "less than a day ago"
              : Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) === 1
              ? "day ago"
              : Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) + " days ago"   
                } </div>}

            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default PendingUsers