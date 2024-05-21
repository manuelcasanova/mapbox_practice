import { useEffect, useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import axios from 'axios';

//Util functions

import fetchUsernameAndId from "./util_functions/FetchUsername";
import fetchPendingUsers from "./util_functions/FetchPendingUsers";
import FollowUserButton from "./util_functions/follow_functions/FollowUserButton";
import fetchLoginHistory from "./util_functions/FetchLoginHistory";

const PendingUsers = () => {

  const { auth } = useAuth();

  const userLoggedin = auth.userId
  const userLoggedInObject = auth;
  const isLoggedIn = auth.loggedIn;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [fake, setFake] = useState(true)
  const [newRequest, setNewRequest] = useState(false)
  const currentDate = new Date();
  const [loginhistory, setLoginHistory] = useState([]);

  // Sort the login history array by login time in descending order
  loginhistory.sort((a, b) => new Date(b.login_time) - new Date(a.login_time));
  
  // console.log("lhs", loginhistory)
  // Check if there are at least two login entries
  if (loginhistory.length >= 2) {
    // Extract the second-to-last login time
    const secondToLastLoginTime = new Date(loginhistory[1].login_time);
    
    // Display the second-to-last login time
    // console.log('Second-to-last login time:', secondToLastLoginTime);
  } else if (loginhistory.length === 1) {
    // If there is only one login entry
    const onlyLoginTime = new Date(loginhistory[0].login_time);
    // console.log('Only login time available:', onlyLoginTime);
  } else {
    // If there are no login entries
    // console.log('User has no login entries.');
  }
  

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
      });
  };

  const dismissMessageFollowRequest = (followeeId, followerId) => {
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
      });
  };


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchPendingUsers(userLoggedin, isLoggedIn, setPendingUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchLoginHistory(auth, setLoginHistory, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [userLoggedin, fake]);

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

  

  const pendingUsersObjectWithMoreInfo = pendingUsersObject.map(user => {
    const pendingUser = pendingUsers.find(pUser => pUser.follower_id === user.id);
    if (pendingUser) {
      const lastModificationDate = new Date(pendingUser.lastmodification);
      const newrequest = pendingUser.newrequest
      // console.log("newrequest", newrequest)
      return {
        ...user,
        follower_id: pendingUser.follower_id,
        lastmodification: lastModificationDate,
        newrequest: newrequest
      };
    }
  });

  //  console.log("PUOWMI", pendingUsersObjectWithMoreInfo)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {!isLoggedIn ? (
        <p>Please log in to see users.</p>
      ) : pendingUsersObjectWithMoreInfo.length === 0 ? (
        <div>No requests pending.</div>
      ) : (
        <div>
          {pendingUsersObjectWithMoreInfo.map(user => (


            <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>



              {user.newrequest && <div>Request made {
              

              //  Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24))


              Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) < 1
              ? "less than a day ago"
              : Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) === 1
              ? "day ago"
              : Math.floor((currentDate - user.lastmodification) / (1000 * 60 * 60 * 24)) + " days ago"
                
                } </div>}

                
              {user.newrequest &&<button onClick={() => { dismissMessageFollowRequest(user.id, userLoggedin) }}>x</button>}
              <div>Id: {user.id}</div>
              <div>{user.username}</div>

              <button onClick={() => { approveFollower(user.id, userLoggedin) }}>Accept request</button>
              <button onClick={() => { dismissFollower(user.id, userLoggedin) }}>Dismiss</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default PendingUsers