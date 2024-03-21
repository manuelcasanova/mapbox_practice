import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'

const UsersFollow = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

//  console.log("users", users)

  useEffect(() => {
    let isMounted = true;
fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

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
        <button>Following</button>
        <button>Followers</button>
        <button>Follow</button>
        
        <div>Search O</div>
        
        {user.loggedIn  ? (
        <div>
{users.map(user => {




  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

      <div>{user.username}</div>
      <div>Follow</div>
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

export default UsersFollow;
