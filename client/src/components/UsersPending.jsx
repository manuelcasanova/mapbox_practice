import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import axios from 'axios';

//Util functions

import fetchUsernameAndId from "./util_functions/FetchUsername";
import fetchPendingUsers from "./util_functions/FetchPendingUsers";
import FollowUserButton from "./util_functions/follow_functions/FollowUserButton";

const PendingUsers = () => {

  const { user } = useAuth();

  const userLoggedin = user.id;
  const userLoggedInObject = user;
  const isLoggedIn = user.loggedIn;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [fake, setFake] = useState(true)
  const [newRequest, setNewRequest] = useState(false)
const currentDate = new Date ();

  // console.log("users", users)
  // console.log("pend", pendingUsers)
  // console.log("current date", currentDate)

  // Function to approve pending users

  const approveFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axios.post('http://localhost:3500/users/approvefollower', data)
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


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchPendingUsers(userLoggedin, isLoggedIn, setPendingUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [userLoggedin, fake]);

  const pendingUsersObject = users.filter(user => {
    const pendingUser = pendingUsers.find(pUser => pUser.follower_id === user.id);
    if (pendingUser) {
      return {
        ...user,
        follower_id: pendingUser.follower_id,
        lastmodification: pendingUser.lastmodification
      };
    }
  });


  const pendingUsersObjectWithDateComparison = pendingUsersObject.map(user => {
    const pendingUser = pendingUsers.find(pUser => pUser.follower_id === user.id);
    if (pendingUser) {
      const lastModificationDate = new Date(pendingUser.lastmodification);
      return {
        ...user,
        follower_id: pendingUser.follower_id,
        lastmodification: lastModificationDate,
        isLaterThanCurrentDate: lastModificationDate > currentDate
      };
    }
  });

  
  // console.log("puobjwithdatecom", pendingUsersObjectWithDateComparison);

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
      ) : pendingUsersObjectWithDateComparison.length === 0 ? (
        <div>No requests pending.</div>
      ) : (
        <div>
          {pendingUsersObjectWithDateComparison.map(user => (

            
            <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
              {user.isLaterThanCurrentDate && <div>New request</div>}
              <div>{console.log("inside user", user)}</div>
              <div>{console.log(currentDate)}</div>
              <div>Id: {user.id}</div>
              <div>{user.username}</div>
            
              <button onClick={() => {approveFollower(user.id, userLoggedin)}}>Accept request</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default PendingUsers