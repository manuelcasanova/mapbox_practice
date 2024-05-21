import React from 'react';
import axios from 'axios';

const ApproveFollowerButton = ({ userLoggedInObject, userLoggedin, user, followers, setFollowers, followeeId, followerId }) => {

  const BACKEND = process.env.REACT_APP_API_URL;

    const pendingAcceptMe = followers.some(follower =>
        follower.follower_id === userLoggedin && follower.followee_id === user.id && follower.status === 'pending'
      );

      const pendingAcceptThem = followers.some(follower =>
        follower.followee_id === userLoggedin && follower.follower_id === user.id && follower.status === 'pending'
      );

      const newDate = new Date()

    const approveFollower = (followeeId, followerId) => {
        const data = {
          followeeId: followeeId,
          followerId: followerId,
          user: userLoggedInObject,
        };

        // console.log("data before axios", data)

        axios.post(`${BACKEND}/users/approvefollower`, data)
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
      <>
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
      </>
    // <div>Approve Follower Button</div>
    );
}

export default ApproveFollowerButton;
