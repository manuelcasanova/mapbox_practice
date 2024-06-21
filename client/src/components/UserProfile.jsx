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
import useAuth from '../hooks/useAuth';
import useLogout from "../hooks/useLogout";

//Util functions
import { deactivateUser } from "./util_functions/user_functions/DeleteUser";
import { updateUsername } from "./util_functions/user_functions/UpdateUsername";

//Components
import UserEditPassword from "./authentication/UserEditPassword";

export default function UserProfile({ setRideAppUndefined, profilePicture, setProfilePicture }) {

  const usernameInputRef = useRef(null);
  const navigate = useNavigate()
  const { auth, setAuth, updateUsername } = useContext(AuthContext);
  const [users, setUsers] = useState();

  console.log("auth", auth)
  console.log("profile picture", profilePicture)


  const loggedInUser = auth;
  const logOut = useLogout(setRideAppUndefined)

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditImageIcons, setShowEditImageIcons] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showErrorFileSize, setShowErrorFileSize] = useState(false);
  const [reload, setReload] = useState(false)
  const BACKEND = process.env.REACT_APP_API_URL;


  // useEffect(() => {
  //   setProfilePicture(`${BACKEND}/${auth.profilePicture}`);
  // }, [auth.profilePicture]);

  useEffect(() => {
    // console.log("profile picture in userprofile", profilePicture)
  }, [profilePicture])

  useEffect(() => {
    if (isEditingUsername) {
      usernameInputRef.current.focus();
    }
  }, [isEditingUsername]);

  useEffect(() => {

  }, [profilePicture])

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
    if (newUsername.trim() !== "" && newUsername.length < 255) {
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

  const handleFileChange = async (e) => {

    setShowErrorFileSize(false)

    const file = e.target.files[0];

    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file && file.size > maxSize) {
      console.error('File size exceeds the limit of 1MB');
      setShowErrorFileSize(true)
      return
    }

    setSelectedFile(file);

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${BACKEND}/profile_pictures/${auth.userId}/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Update profile picture URL and toggle upload file section visibility
        const newProfilePictureUrlForAuth = `${BACKEND}/profile_pictures/${auth.userId}/profile_picture.jpg`
        setAuth(prevAuth => ({
          ...prevAuth,
          profilePicture: newProfilePictureUrlForAuth
        }));
        setProfilePicture(`${
          // auth.profilePicture
          newProfilePictureUrlForAuth
        }?${Date.now()}`);
        setShowUploadFile(false); // Assuming setShowUploadFile is used to toggle visibility

        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setReload(prev => !prev)

  };


  return (
    <>
      {!auth || Object.keys(auth).length === 0 ? (<>Please log in to see the user profile.</>) :
        (
          <div className="user-profile">

            {!showUploadFile && (
              <>
                {auth.profilePicture !== null && auth.profilePicture && auth.profilePicture.endsWith('.jpg') ? (
                  <div className="user-profile-image-container" onMouseEnter={() => setShowEditImageIcons(true)} onMouseLeave={() => setShowEditImageIcons(false)} onClick={() => setShowUploadFile(prev => !prev)}>


<img
  className="user-profile-image"
  src={profilePicture.includes(`${BACKEND}`) ? profilePicture : `${BACKEND}/${profilePicture}`}
  alt=""
/>




                    {/* <FontAwesomeIcon icon={faEdit} onClick={() => setShowUploadFile(prev => !prev)} /> */}
                    {showEditImageIcons && (
                      <div className='hover-edit-image-buttons'>
                        <FontAwesomeIcon icon={faImage} />
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="user-profile-default-icon" onClick={() => navigate('/user/profile')}>
                    {/* <FontAwesomeIcon icon={faUser} /> */}
                    <FontAwesomeIcon icon={faImage} onClick={() => setShowUploadFile(prev => !prev)} />
                    <FontAwesomeIcon icon={faPlus} onClick={() => setShowUploadFile(prev => !prev)} />
                  </div>
                )}
              </>
            )

            }

            {showUploadFile && (
              <>
                <div className="file-upload-section">
                  <input type="file" accept=".jpg" onChange={handleFileChange} />
                  {showErrorFileSize && <div>File size exceeds the limit of 1MB</div>}
                  {/* <button className="orange-button small-button" onClick={handleFileUpload}>Upload Profile Picture</button>*/
                    <button className='red-button button-close small-button' style={{ width: '50px' }} onClick={() => setShowUploadFile(prev => !prev)}>x</button>}
                </div>

              </>
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