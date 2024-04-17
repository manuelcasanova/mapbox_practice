import React from 'react';
import axios from 'axios';

const FollowUserButton = ({ user, followers, setFollowers, followeeId, followerId, userLoggedInObject }) => {

  const userLoggedin = userLoggedInObject.id


  const amFollowingThem = followers.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'accepted'
  );

  const amBeingFollowedByThem = followers.some(follower =>
    follower.follower_id === followeeId && follower.followee_id === followerId && follower.status === 'accepted'
  );

  const pendingAcceptMe = followers.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'pending'
  );

  // const pendingAcceptMe2 = followers.some(follower =>
  //   follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
  // );

  const pendingAcceptThem = followers.some(follower =>
    follower.followee_id === followerId && follower.follower_id === followeeId && follower.status === 'pending'
  );


  // const pendingAcceptThem2 = followers.some(follower =>
  //   follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'pending'
  // );


  // console.log("pendingAcceptme1", pendingAcceptMe, "pendinAcceptme2", pendingAcceptMe2, "pendingAccempthem1", pendingAcceptThem, "pendingacceptthem2", pendingAcceptThem2)

  // Function to follow a user
  const followUser = (followeeId, followerId) => {

    // console.log(`Following user with ID ${followeeId} from user with ID ${followerId}`);

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
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


  // Function to unfollow a user
  const unfollowUser = (followeeId, followerId) => {
    // console.log(`Unfollowing user with ID ${followeeId} from user with ID ${followerId}`);

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
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

  const approveFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axios.post('http://localhost:3500/users/approvefollower', data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = followers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowers(updatedFollowers);
        } else {
          setFollowers(prevFollowers => [...prevFollowers, newFollower]);
        }
      })
      .catch(error => {
        console.error('Error approving follower:', error);
      });
};

  const handleFollow = () => {
    followUser(followeeId, followerId);
  };

  const handleUnfollow = () => {
    unfollowUser(followeeId, followerId);
  };

  return (
    <div>


      {!amFollowingThem && !pendingAcceptMe && !amBeingFollowedByThem && <button onClick={handleFollow}>Follow</button>}

      {amFollowingThem && <button onClick={handleUnfollow}>Unfollow</button>}

      {!amFollowingThem && amBeingFollowedByThem && !pendingAcceptMe && <button onClick={handleFollow}>Follow back</button>}


{pendingAcceptMe && <div>Request sent</div>}

{pendingAcceptThem && <button onClick={() => { approveFollower(followeeId, followerId)}}>Approve request</button>}

    </div>



  );
};

export default FollowUserButton;
