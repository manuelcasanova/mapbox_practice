import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchFriendships from './util_functions/FetchFriendships';

const UsersFollow = () => {
  const [users, setUsers] = useState([]);
  const [friendships, setFriendships] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect (() => {
    console.log("friendships", friendships)
  })


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
fetchFriendships(user, setUsers, friendships, setFriendships, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
      controller.abort();
    };
  }, [user]); //Probably change for friendships

// useEffect(() => {
//   let isMounted = true;
//   const controller = new AbortController();

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3500/users/friendships`);
//       // console.log("API Response:", response.data); // Log API response
//       if (isMounted) {
//         setFriendships(response.data);

//       }
      
//       setIsLoading(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   fetchData();

//   return () => {
//     isMounted = false;
//     controller.abort();
//   };

// }, []);

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
