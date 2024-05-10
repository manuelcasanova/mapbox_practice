//Hooks
import React, { useState, useEffect } from 'react';

//Libraries
import axios from 'axios';

//Context
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"

//Util functions
import { activateUser } from './util_functions/user_functions/DeleteUser';
import { deactivateUser } from './util_functions/user_functions/DeleteUser';
import { deleteUser } from './util_functions/user_functions/DeleteUser';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

//  console.log("users", users)

const loggedInUser = auth;
//  console.log("loggedInUser in Users Admin", loggedInUser)

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      
      try {
        if (!auth || Object.keys(auth).length === 0) {
          throw new Error("User authentication information is missing.");
        }

        const response = await axios.get('http://localhost:3500/users/', {
          params: {
            user: auth 
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
  }, [auth]);

  const handleDeactivate = async (user) => {
    await deactivateUser(user, loggedInUser);
    setUsers(users.map(u => u.id === user.id ? { ...u, isactive: false } : u));
  };

  const handleActivate = async (user) => {
    await activateUser(user, loggedInUser);
    setUsers(users.map(u => u.id === user.id ? { ...u, isactive: true } : u));
  };

  const handleDelete = async (user) => {
    await deleteUser(user, user.id, setUsers, loggedInUser);
    setUsers(users.filter(u => u.id !== user.id));
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
        {auth.accessToken !== undefined && auth.isAdmin ? (
        <div>
{users.map(user => {


// console.log("user,", user)

  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={user.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
  {!user.isactive && <div>User is inactive</div>}
      <div>Id: {user.id}</div>
      <div>Name: {user.username}</div>
      <div>Email: {user.email}</div>
      {loggedInUser.isSuperAdmin && !user.issuperadmin && user.isactive && <button onClick={() => handleDeactivate(user)}>Inactivate</button>}
      {loggedInUser.isSuperAdmin && !user.issuperadmin && !user.isactive && <button 
       onClick={() => handleActivate(user)}
      >Activate</button>}
      {loggedInUser.isSuperAdmin && !user.issuperadmin && <button onClick={()=> handleDelete(user)}>Delete</button>}
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
