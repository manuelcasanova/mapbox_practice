//Hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";

//Context
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";

//Util functions
import { deactivateUser } from "./util_functions/user_functions/DeleteUser";

export default function UserProfile({setRideAppUndefined}) {

  const navigate = useNavigate()

  const { auth } = useAuth();
  // console.log("user int UserProfile", user)
  console.log("auth in UserProfile", auth)
  const loggedInUser = auth;
  const logOut = useLogout(setRideAppUndefined)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleShowConfirmDelete = () => {setShowConfirmDelete(prev => !prev)}
  const handleDeactivateUser = () => {
    deactivateUser(auth, loggedInUser);
    logOut()
     handleShowConfirmDelete()
     navigate('/')
  };

  return (
    <>
    {!auth || Object.keys(auth).length === 0 ? (<>Please log in to see the user profile.</>) :
     (
        <>
          <div>Image:</div>
          <div>Username: {auth.username}</div>
          <div>Email: {auth.email}</div>
          <div>Password: {auth.password}</div>
          <div>Permissions: {auth.isSuperAdmin ? 'Super Admin' : auth.isAdmin ? 'Admin' : 'User'}</div>

          {!showConfirmDelete && <button onClick={() => setShowConfirmDelete(true)}>Delete Account</button>}
          {showConfirmDelete && <button onClick={handleDeactivateUser}>Confirm Delete Account. Can't be undone</button>}
        </>
      )
    }
    </>
  );

}