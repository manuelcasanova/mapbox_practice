import React from 'react';
import axios from 'axios';

const ApproveFollowerButton = ({ userLoggedInObject, userLoggedin, user, followers, setFollowers, followeeId, followerId }) => {

    const pendingAcceptMe = followers.some(follower =>
        follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
      );

      const pendingAcceptThem = followers.some(follower =>
        follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'pending'
      );


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

    return (
      <div>
        {pendingAcceptThem && (
          <button
            onClick={() => {
              approveFollower(followeeId, followerId);
            }}
          >
            Approve follower
          </button>
        )}

{pendingAcceptMe && <div>Requested to follow</div>}
      </div>
    // <div>Approve Follower Button</div>
    );
}

export default ApproveFollowerButton;
