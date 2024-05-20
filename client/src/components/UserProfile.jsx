//Hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";

//Context
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";

//Util functions
import { deactivateUser } from "./util_functions/user_functions/DeleteUser";
import { updateUsername } from "./util_functions/user_functions/UpdateUsername";

export default function UserProfile({setRideAppUndefined}) {

  const navigate = useNavigate()

  const { auth } = useAuth();
  // console.log("user int UserProfile", user)
  // console.log("auth in UserProfile", auth.username)

  const loggedInUser = auth;
  const logOut = useLogout(setRideAppUndefined)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);



  const handleShowConfirmDelete = () => {setShowConfirmDelete(prev => !prev)}
  const handleDeactivateUser = () => {
    deactivateUser(auth, loggedInUser);
    logOut()
     handleShowConfirmDelete()
     navigate('/')
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim() !== "") {
      updateUsername(auth, newUsername.trim());
      setIsEditingUsername(false);
      setNewUsername(""); 
      logOut()
      navigate('/login')
    }
  };


  return (
    <>
    {!auth || Object.keys(auth).length === 0 ? (<>Please log in to see the user profile.</>) :
     (
        <>
          <div>Image:</div>
          <div>Username: {isEditingUsername ? 
            <input type="text" value={newUsername} onChange={handleUsernameChange} /> :
            <>
              {auth.username} 
              <button onClick={() => setIsEditingUsername(true)}>Edit</button>
            </>
          }</div>
            {isEditingUsername && <button onClick={handleUpdateUsername}>Save changes</button>}
          <div>Email: {auth.email}</div>
          <div>Permissions: {auth.isSuperAdmin ? 'Super Admin' : auth.isAdmin ? 'Admin' : 'User'}</div>

          {!showConfirmDelete && <button onClick={() => setShowConfirmDelete(true)}>Delete Account</button>}
          {showConfirmDelete && <button onClick={handleDeactivateUser}>Confirm Delete Account. Can't be undone</button>}
        
        </>
      )
    }
    </>
  );

}