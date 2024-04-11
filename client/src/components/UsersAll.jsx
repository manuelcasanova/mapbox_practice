import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";
import axios from 'axios'

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
    // console.log("followers", followers)
    // console.log("users", users)
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

//Function to follow a user

  const followUser = (followeeId, followerId) => {

    // console.log(`Following user with ID ${followeeId} from user with ID ${followerId}`);

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: user
    };

    axios.post('http://localhost:3500/users/follow', data)
      .then(response => {

        // console.log('Follow request sent successfully:', response.data);

        const newFollower = response.data;

        // Check if the new follower already exists in the state
        const existingFollowerIndex = followers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        // If an existing follower is found, replace it with the new follower
        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowers(updatedFollowers);
          console.log('Follower replaced in state:', newFollower);
        } else {
          // If no existing follower found, add the new follower to the state
          setFollowers(prevFollowers => [...prevFollowers, newFollower]);
          // console.log('New follower added to state:', newFollower);
        }

      })
      .catch(error => {
        console.error('Error sending follow request:', error);
      });

  };

  //Function to unfollow a user

  const unFollowUser = (followeeId, followerId) => {
    // console.log(`Unfollowing user with ID ${followeeId} from user with ID ${followerId}`);
  
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: user
    };
  
    axios.post('http://localhost:3500/users/unfollow', data)
      .then(response => {
        // console.log('Unfollow request sent successfully');
  
        const removedFollower = response.data;
  
        // Remove the unfollowed user from the state
        const updatedFollowers = followers.filter(follower =>
          !(follower.follower_id === removedFollower.follower_id &&
            follower.followee_id === removedFollower.followee_id)
        );
  
        setFollowers(updatedFollowers);
        // console.log('Follower removed from state:', removedFollower);
      })
      .catch(error => {
        console.error('Error sending unfollow request:', error);
      });
  };

  // Function to approve a follow request

  const approveFollower = (followeeId, followerId) => {
    // console.log(`Approving follower with ID ${followerId} for user with ID ${followeeId}`);

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: user
    };
 
    axios.post('http://localhost:3500/users/approvefollower', data)
      .then(response => {
        // console.log('Follower approved successfully:', response.data);
     
        const newFollower = response.data;

        // Check if the new follower already exists in the state
        const existingFollowerIndex = followers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        // If an existing follower is found, replace it with the new follower
        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowers(updatedFollowers);
          // console.log('Follower replaced in state:', newFollower);
        } else {
          // If no existing follower found, add the new follower to the state
          setFollowers(prevFollowers => [...prevFollowers, newFollower]);
          console.log('New follower added to state:', newFollower);
        }


      })
      .catch(error => {
        console.error('Error approving follower:', error);
      });
  };

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


                    {amFollowingThem && !areFollowingMe && <button
                      onClick={() => {
                        unFollowUser(user.id, userLoggedin)
                      }}
                    >Unfollow</button>}
                    {amFollowingThem && areFollowingMe && <button
                      onClick={() => {
                        unFollowUser(user.id, userLoggedin)
                      }}
                    >Unfollow</button>}


                    {pendingAcceptThem && <button
                      onClick={() => {
                        approveFollower(userLoggedin, user.id)
                      }}
                    >Approve follower</button>}

                    {!amFollowingThem && areFollowingMe && !pendingAcceptMe && <button
                      onClick={() => {
                        followUser(user.id, userLoggedin)
                      }}
                    >Follow back</button>}
                    {!amFollowingThem && !areFollowingMe && !pendingAcceptMe && <button
                      onClick={() => {
                        followUser(user.id, userLoggedin)
                      }}
                    >Follow</button>}

                    {pendingAcceptMe && <div>Requested to follow</div>}

                    {isMuted && <button
                      onClick={() => {
                        console.log("Unmute")
                      }}
                    >Unmute</button>}
                    {!isMuted && <button
                      onClick={() => {
                        console.log("Mute")
                      }}
                    >Mute</button>}


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
