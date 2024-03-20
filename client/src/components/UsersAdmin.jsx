import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "./Context/AuthContext";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

// console.log("users", users)

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/users/', {
          params: {
            user: user 
          }
        });
        if (isMounted) {
          setUsers(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error)
          } else {
            setError(error.message)
          }
          setIsLoading(false);
        }
      }
    };

    fetchData();

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
        {user.loggedIn && user.isAdmin ? (
        <div>
{users.map(user => {




  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
      <div>Id: {user.id}</div>
      <div>Name: {user.username}</div>
      <div>Email: {user.email}</div>
      <div>Edit</div>
      <div>Delete</div>
    </div>
  );
})}


        </div>
            ) : (
              <p>Please log in as an administrator to see users.</p>
            )}
          </>
      )}
    </div>
  );
};

export default UsersAdmin;
