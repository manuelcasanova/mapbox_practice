//Hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";

//Context
import { useAuth } from "./Context/AuthContext";

//Util functions
import { deactivateUser } from "./util_functions/user_functions/DeleteUser";

export default function UserProfile({setRideAppUndefined}) {

  const navigate = useNavigate()

  const { user, logOut } = useAuth();
  // console.log("user int UserProfile", user)
  const loggedInUser = user;

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleShowConfirmDelete = () => {setShowConfirmDelete(prev => !prev)}
  const handleDeactivateUser = () => {
    deactivateUser(user, loggedInUser);
     logOut(setRideAppUndefined);
     handleShowConfirmDelete()
     navigate('/')
  };

  return (
    <>
      {user.loggedIn && (
        <>
          <div>Image:</div>
          <div>Username: {user.username}</div>
          <div>Email: {user.email}</div>
          <div>Password: {user.password}</div>
          <div>Permissions: {user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}</div>

          {!showConfirmDelete && <button onClick={() => setShowConfirmDelete(true)}>Delete Account</button>}
          {showConfirmDelete && <button onClick={handleDeactivateUser}>Confirm Delete Account. Can't be undone</button>}
        </>
      )}
    </>
  );

}