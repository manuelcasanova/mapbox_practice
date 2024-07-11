import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";

import { faUser, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/Navsidebar.css'
import '../styles/Hamburger.css'


export default function Navsidebar({ setFromButton, rideApp, setRideAppUndefined, toggleNavsidebar, handleMouseLeave, profilePicture }) {

  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const downArrow = "⌄"

  const signOut = async () => {
    await logout();
    setRideAppUndefined()
    toggleNavsidebar()
    navigate('/');

  }

  const [showOptions, setShowOptions] = useState({
    myprofile: false,
    ride: false,
    map: false,
    user: false,
    admin: false
  });

  const toggleDropdown = (category) => {
    setShowOptions((prevOptions) => {
      const newOptions = {};
      // Close all dropdowns except the one being toggled
      Object.keys(prevOptions).forEach((key) => {
        newOptions[key] = key === category ? !prevOptions[key] : false;
      });
      return newOptions;
    });
  };

  const handleSelectOption = (route, category) => {
    navigate(route);
    toggleDropdown(category);
    toggleNavsidebar();
  };

  useEffect(() => {

  }, [profilePicture])

  return (
    <div className="navsidebar"
      onMouseLeave={handleMouseLeave}
    >


      {Object.keys(auth).length &&

        <div
          className="navsidebar-dropdown-wrapper navsidebar-my-account"
          onClick={() => toggleDropdown("myprofile")}
        >
          <div className="navsidebar-dropdown-wrapper-text"
          >
            {auth.profilePicture !== null && auth.profilePicture && auth.profilePicture.endsWith('.jpg') ? (
              <img className="navsidebar-profile-picture" src={profilePicture} alt="" />
            ) : (
              <div className="navsidebar-profile-default-icon" onClick={() => navigate('/user/profile')}>
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>

          {showOptions.myprofile && (
            <div className="navsidebar-dropdown">
              <button onClick={() => handleSelectOption("/user/profile", "myprofile")}>
                My Account
              </button>
              <button onClick={() => signOut()}><FontAwesomeIcon icon={faSignOut} /></button>
            </div>
          )}
        </div>
      }

      <div
        className="navsidebar-dropdown-wrapper"
        onClick={() => toggleDropdown("ride")}
      >
        <div className="navsidebar-title"
        >
          {rideApp ? (
            <>
              <span className="navsidebar-dropdown-wrapper-text">Rides</span>
              <span className="down-arrow">{downArrow}</span>
            </>
          ) : (
            <>
              <span className="navsidebar-dropdown-wrapper-text">Runs</span>
              <span className="down-arrow">{downArrow}</span>
            </>
          )}
        </div>


        {rideApp && showOptions.ride && (
          <div className="navsidebar-dropdown">
            <button onClick={() => handleSelectOption("/rides/public", "ride")}>See all rides</button>
            <button onClick={() => handleSelectOption("/rides/mine", "ride")}>Manage my rides</button>
            <button onClick={() => handleSelectOption("/createride", "ride")}>Create a new ride</button>
          </div>
        )}


        {!rideApp && showOptions.ride && (
          <div className="navsidebar-dropdown">
            <button onClick={() => handleSelectOption("/runs/public", "run")}>See all runs</button>
            <button onClick={() => handleSelectOption("/runs/mine", "run")}>Manage my runs</button>
            <button onClick={() => handleSelectOption("/createrun", "run")}>Create a new run</button>
          </div>
        )}



      </div>

      <div
        className="navsidebar-dropdown-wrapper"
        onClick={() => toggleDropdown("map")}
      >
        <div className="navsidebar-title"
        >

          <span className="navsidebar-dropdown-wrapper-text">Maps</span>
          <span className="down-arrow">{downArrow}</span>

        </div>



        {showOptions.map && (
          <div className="navsidebar-dropdown">
            <button onClick={() => handleSelectOption("/maps/public", "map")}>See all maps</button>
            <button onClick={() => {
              setFromButton(true)
              handleSelectOption("/maps", "map")
            }
            }
            >Manage my maps</button>
            <button onClick={() => handleSelectOption("/maps/create", "map")}>Create a new map</button>
          </div>
        )}
      </div>

      <div
        className="navsidebar-dropdown-wrapper"
        onClick={() => toggleDropdown("user")}
      >
        <div className="navsidebar-title"
        >
          <span className="navsidebar-dropdown-wrapper-text">Users</span>
          <span className="down-arrow">{downArrow}</span>
        </div>
        {showOptions.user && (
          <div className="navsidebar-dropdown">
            <button onClick={() => handleSelectOption("/users/all", "user")}>See all users</button>
            <button onClick={() => handleSelectOption("/users/followee", "user")}>Following</button>
            <button onClick={() => handleSelectOption("/users/followers", "user")}>Followers</button>
            <button onClick={() => handleSelectOption("/users/pending", "user")}>Pending requests</button>
            <button onClick={() => handleSelectOption("/users/muted", "user")}>Muted</button>
          </div>
        )}
      </div>



      {auth && auth.isAdmin && (

        <div
          className="navsidebar-dropdown-wrapper"
          onClick={() => toggleDropdown("admin")}
        >
          <div className="navsidebar-title"

          >
            <span className="navsidebar-dropdown-wrapper-text">Admin</span>
            <span className="down-arrow">{downArrow}</span>
          </div>
          {showOptions.admin && (
            <div className="navsidebar-dropdown">


              {rideApp ? <button onClick={() => handleSelectOption("/rides/all", "admin")}>Admin rides</button> : <button onClick={() => handleSelectOption("/runs/all", "admin")}>Admin runs</button>}

              <button onClick={() => handleSelectOption("/users/admin", "admin")}>Admin users</button>

              {rideApp ?
                <button onClick={() => handleSelectOption("/rides/messages/reported", "admin")}>Reported messages</button>
                :
                <button onClick={() => handleSelectOption("/runs/messages/reported", "admin")}>Reported messages</button>
              }

              {rideApp ?
                <button onClick={() => handleSelectOption("/rides/messages/flagged", "admin")}>Flagged messages</button>
                :
                <button onClick={() => handleSelectOption("/runs/messages/flagged", "admin")}>Flagged messages</button>
              }


            </div>
          )}
        </div>

      )}

      {!showOptions.myprofile && (
        <div className="navsidebar-dropdown">
          <button
            title="Logout"
            onClick={() => { signOut() }}
            className="navsidebar-logout-button"
          ><FontAwesomeIcon icon={faSignOut} /></button>
        </div>
      )}


    </div>
  );
}
