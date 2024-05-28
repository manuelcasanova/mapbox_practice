//Styles
import '../styles/UserProfile.css'
import { faUser, faImage, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Hooks
import { useState, useContext, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

//Context
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";

//Util functions
import { deactivateUser } from "./util_functions/user_functions/DeleteUser";
import { updateUsername } from "./util_functions/user_functions/UpdateUsername";

//Components
import UserEditPassword from "./authentication/UserEditPassword";

export default function UserProfile({ setRideAppUndefined }) {

  const usernameInputRef = useRef(null);
  const navigate = useNavigate()
  const { auth, updateUsername } = useContext(AuthContext);
  const [users, setUsers] = useState();
  const profilePicture = 'http://localhost:3500/profile_pictures/' + auth.profilePicture;

  // console.log("user int UserProfile", user)
  // console.log("auth in UserProfile", auth.username)

  const loggedInUser = auth;
  const logOut = useLogout(setRideAppUndefined)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false)

  // console.log(newUsername)

  useEffect(() => {
    if (isEditingUsername) {
      usernameInputRef.current.focus();
    }
  }, [isEditingUsername]);

  const handleShowEditPassword = () => {
    setShowEditPassword(prev => !prev)
    setShowConfirmDelete(false)
    setIsEditingUsername(false)
  }

  const handleShowConfirmDelete = () => { 
    setShowConfirmDelete(true)
    setShowEditPassword(false)
    setIsEditingUsername(false)
  }



  const handleDeactivateUser = () => {
    deactivateUser(auth, loggedInUser);
    logOut()
    handleShowConfirmDelete()
    navigate('/')
  };

  const handleNo = () => {
    {
      setShowConfirmDelete(false)
      setIsEditingUsername(false)

    }
  }

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim() !== "") {
      updateUsername(newUsername.trim());
      setIsEditingUsername(false);
      setNewUsername("");
      // logOut()
      // navigate('/login')
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true)
    setShowConfirmDelete(false)
    setShowEditPassword(false)
    
  }

  return (
    <>
      {!auth || Object.keys(auth).length === 0 ? (<>Please log in to see the user profile.</>) :
        (
          <div className="user-profile">

            {auth.profilePicture !== null && auth.profilePicture.endsWith('.jpg') ? (
              <div className="user-profile-image-container">
                <img className="user-profile-image" src={profilePicture} alt={auth.username} />
                <FontAwesomeIcon icon={faEdit} />
              </div>
            ) : (
              <div className="user-profile-default-icon" onClick={() => navigate('/user/profile')}>
                {/* <FontAwesomeIcon icon={faUser} /> */}
                <FontAwesomeIcon icon={faImage} />
                <FontAwesomeIcon icon={faPlus} />
              </div>
            )}



            <div className="user-profile-username-container">

              {isEditingUsername ?
                <input type="text" ref={usernameInputRef} value={newUsername} onChange={handleUsernameChange} placeholder="Insert new username" /> :
                <div className='user-profile-username'>
                  {auth.username}
                  <div className="user-profile-email">{auth.email}</div>
                  <button className='user-profile-edit-button' onClick={() => handleEditUsername()}>Modify username</button>
                </div>
              }

            </div>

            {isEditingUsername &&
              <div className='user-profile-edit-buttons-container'>
             
                <button
                  disabled={newUsername === ""}
                  className="user-profile-save-username-button" onClick={handleUpdateUsername} >Save username</button>
                   <button className='user-profile-delete-button-close' onClick={handleNo}>X</button>
              </div>

            }
            {/* <div className="user-profile-permissions">Permissions: {auth.isSuperAdmin ? 'Super Admin' : auth.isAdmin ? 'Admin' : 'User'}</div> */}

            {!showEditPassword &&
              <button className='user-profile-edit-button' onClick={() => handleShowEditPassword()}>Modify password</button>
            }

            {showEditPassword &&
              <button className='user-profile-delete-button-close' onClick={() => setShowEditPassword(false)}>X</button>
            }



            {showEditPassword &&
              <UserEditPassword user={auth} users={users} setUsers={setUsers} />
            }


            <div className="delete-buttons-container">
              {!showConfirmDelete &&
                <button className='user-profile-delete-button' onClick={handleShowConfirmDelete}>Delete Account</button>}
              {showConfirmDelete &&
                <>
                  <button className='user-profile-delete-button-close' onClick={handleNo}>X</button>
                  <button className='user-profile-delete-button' onClick={handleDeactivateUser}>Confirm Delete Account</button>
                </>
              }
            </div>


          </div>
        )
      }
    </>
  );

}