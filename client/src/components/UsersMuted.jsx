import { useEffect, useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"

//Util functions

import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchUsernameAndId from "./util_functions/FetchUsername";
import MuteUserButton from "./util_functions/mute_functions/MuteUserButton";

const MutedUsers = () => {

  const { auth } = useAuth();

  const userLoggedin = auth.userId
  const isLoggedIn = auth.accessToken !== undefined;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [mutedUsers, setMutedUsers] = useState([])
  const [showLargePicture, setShowLargePicture] = useState(null)
  const BACKEND = process.env.REACT_APP_API_URL;
  const [hasMutedChanges, setHasMutedChanges] = useState(false);

  // console.log("users in UsersMuted", users)
  // console.log("mutedUsers in UsersMuted", mutedUsers)
  // console.log("has muted changes", hasMutedChanges)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [userLoggedin, hasMutedChanges]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };


  const mutedUserObjects = mutedUsers
  .filter(mutedUser => mutedUser.muter === userLoggedin)
  .map(mutedUser => users.find(user => user.id === mutedUser.mutee));

  // console.log("mutedUserObjects in UsersMuted.jsx", mutedUserObjects)



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
      ) : mutedUserObjects.length === 0 ? (<>
         <div className="users-title">Muted users</div>
       <div>No muted users.</div>
      </>
       
      ) : (
        <div>
          <div className="users-title">Muted users</div>
          {mutedUserObjects.map(user => (
            <div 
            className='users-all-user'
             key={user.id} >
            <div className='users-all-picture-container'
                  
                        >
                          <img       onClick={() => setShowLargePicture(user.id)} className='users-all-picture' src={`${BACKEND}/profile_pictures/${user.id}/profile_picture.jpg`}  
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




              <MuteUserButton userId={user.id} userLoggedin={userLoggedin} 
              
              isMuted={mutedUsers.some(mute => 
                (mute.muter === user.id && mute.mutee === userLoggedin) || 
                (mute.muter === userLoggedin && mute.mutee === user.id)
              )}
              
              
              setMutedUsers={setMutedUsers} onMutedChange={handleMutedChanges}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default MutedUsers