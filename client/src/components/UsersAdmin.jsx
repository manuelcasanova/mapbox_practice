//Hooks
import React, { useState, useEffect } from 'react';

//Libraries
import axios from 'axios';

//Context
import { useAuth } from "./Context/AuthContext";

//Util functions
import { deactivateUser } from './util_functions/user_functions/DeleteUser';
import { deleteUser } from './util_functions/user_functions/DeleteUser';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

//  console.log("users", users)

const loggedInUser = user;
// console.log("loggedInUser", loggedInUser)

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
  }, [user, users]);

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
  {!user.isactive && <div>User is inactive</div>}
      <div>Id: {user.id}</div>
      <div>Name: {user.username}</div>
      <div>Email: {user.email}</div>
      {loggedInUser.isSuperAdmin && !user.issuperadmin && <button onClick={()=> deactivateUser(user, loggedInUser)}>Inactivate</button>}
      {loggedInUser.isSuperAdmin && !user.issuperadmin && <button onClick={()=> deleteUser(user, user.id, setUsers, loggedInUser)}>Delete</button>}
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
