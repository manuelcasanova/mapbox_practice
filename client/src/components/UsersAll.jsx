import React, { useState, useEffect } from 'react';
import { useAuth } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFollowee from './util_functions/FetchFollowee';
import fetchMutedUsers from './util_functions/FetchMutedUsers';
import MuteUserButton from './util_functions/mute_functions/MuteUserButton';
import FollowUserButton from './util_functions/follow_functions/FollowUserButton';
// import ApproveFollowerButton from './util_functions/follow_functions/ApproveFollower';

const UsersAll = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [followers, setFollowers] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
   console.log("user in Users All", user)
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const userLoggedin = user.data.userId
  const userLoggedInObject = user
  const usersExceptMe = users.filter(user => user.id !== userLoggedin);
  const isLoggedIn = user.data.userId !== null

  // console.log("users", users)
  // console.log("followers", followers)
  // console.log("userLoggedin", userLoggedin)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    fetchFollowee(user, setFollowers, setIsLoading, setError, isMounted)
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user, hasMutedChanges]);

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


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const allUsersMutedOrMe = usersExceptMe.every(user => mutedUsers.includes(user.id));

  return (
    <div>
      {allUsersMutedOrMe ? (
        <div>No users available or all users are muted.</div>
      ) : (
        <>

          {user.loggedIn ? (
            <div>
              {followingEachOther.map((isFollowing, index) => {
                const user = usersExceptMe[index];
                const isMuted = mutedUsers.includes(user.id);

                if (!isMuted) {
                  return (
                    <div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
                      <div>Id: {user.id}</div>
                      <div>{user.username}</div>
                      <FollowUserButton followeeId={user.id} followerId={userLoggedin} user={user} followers={followers} setFollowers={setFollowers} userLoggedInObject={userLoggedInObject} />
                      <MuteUserButton userId={user.id} userLoggedin={userLoggedin} isMuted={mutedUsers.includes(user.id)} setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges} />
                      {isFollowing && 
                      
                      <button onClick={() => { navigate(`/users/messaging/${user.id}`, { state: { userForMessages: user.id } }) }}>Messages</button>

                      
                      }
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
  );
};

export default UsersAll;
