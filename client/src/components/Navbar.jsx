import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/Navbar.css'


export default function Navbar({ setFromButton, rideApp, setRideAppUndefined }) {

  // console.log("rideApp in Navbar", rideApp)
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const downArrow = "⌄"

  //  console.log("auth in Navbar", auth)

  const profilePicture = 'http://localhost:3500/' + auth.profilePicture;

  const signOut = async () => {
    await logout();
    setRideAppUndefined()
    navigate('/');
  }

  const [showOptions, setShowOptions] = useState({
    ride: false,
    map: false,
    user: false,
    admin: false,
  });

  const handleSelectOption = (route, category) => {
    navigate(route);
    setShowOptions({ ...showOptions, [category]: false });
  };

  const handleMouseEnter = (category) => {
    setShowOptions({ ...showOptions, [category]: true });
    // Hide other dropdowns
    Object.keys(showOptions).forEach((key) => {
      if (key !== category) {
        setShowOptions((prev) => ({ ...prev, [key]: false }));
      }
    });
  };

  const handleMouseLeave = (category) => {
    setShowOptions({ ...showOptions, [category]: false });
  };

  return (
    <div className="navbar">

      <div
        className="dropdown-wrapper"
        onMouseEnter={() => handleMouseEnter("ride")}
        onMouseLeave={() => handleMouseLeave("ride")}
      >
        <div
          className="navbar-title"
          onClick={() => handleMouseEnter(rideApp ? "ride" : "run")}>
          {rideApp ? (
            <>
              <span className="dropdown-wrapper-text">Rides</span>
              <span className="down-arrow">{downArrow}</span>
            </>
          ) : (
            <>
              <span className="dropdown-wrapper-text">Runs</span>
              <span className="down-arrow">{downArrow}</span>
            </>
          )}
        </div>


        {rideApp && showOptions.ride && ( 
          <div className="dropdown">
            <button onClick={() => handleSelectOption("/rides/public", "ride")}>See all rides</button>
            <button onClick={() => handleSelectOption("/rides/mine", "ride")}>Manage my rides</button>
            <button onClick={() => handleSelectOption("/createride", "ride")}>Create a new ride</button>
          </div>
        )}


        {!rideApp && showOptions.ride && (
          <div className="dropdown">
            <button onClick={() => handleSelectOption("/runs/public", "ride")}>See all runs</button>
            <button
              onClick={() => {
                handleSelectOption("/runs/mine", "ride");

              }}
            >Manage my runs</button>
            <button
              onClick={() => {
                handleSelectOption("/createrun", "ride");
              }}
            >
              Create a new run
            </button>
          </div>
        )}



      </div>

      <div
        className="dropdown-wrapper"
        onMouseEnter={() => handleMouseEnter("map")}
        onMouseLeave={() => handleMouseLeave("map")}
      >
        <div
          className="navbar-title"
          onClick={() => handleMouseEnter("map")}>

          <span className="dropdown-wrapper-text">Maps</span>
          <span className="down-arrow">{downArrow}</span>

        </div>



        {showOptions.map && (
          <div className="dropdown">
            <button className="dropdown-button-text" onClick={() => handleSelectOption("/maps/public", "map")}>See all maps</button>
            <button onClick={() => {
              setFromButton(true)
              handleSelectOption("/maps", "map")
            }
              }>Manage my maps</button>
            <button onClick={() => handleSelectOption("/maps/create", "map")}>Create a new map</button>
          </div>
        )}
      </div>

      <div
        className="dropdown-wrapper"
        onMouseEnter={() => handleMouseEnter("user")}
        onMouseLeave={() => handleMouseLeave("user")}
      >
        <div
          className="navbar-title"
          onClick={() => handleMouseEnter("user")}>
          <span className="dropdown-wrapper-text">Users</span>
          <span className="down-arrow">{downArrow}</span>
        </div>
        {showOptions.user && (
          <div className="dropdown">
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
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter("admin")}
          onMouseLeave={() => handleMouseLeave("admin")}
        >
          <div
            className="navbar-title"
            onClick={() => () => handleMouseEnter("admin")}>
            <span className="dropdown-wrapper-text">Admin</span>
            <span className="down-arrow">{downArrow}</span>
          </div>
          {showOptions.admin && (
            <div className="dropdown">


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

      {Object.keys(auth).length &&

        <div
          className="dropdown-wrapper my-account"
          onMouseEnter={() => handleMouseEnter("myprofile")}
          onMouseLeave={() => handleMouseLeave("myprofile")}
        >
          <div onClick={() => handleMouseEnter("myprofile")}>
            {auth.profilePicture !== null && auth.profilePicture && auth.profilePicture.endsWith('.jpg') ? (
              <img className="profile-picture" src={profilePicture} alt={auth.username} />
            ) : (
              <div className="profile-default-icon" onClick={() => navigate('/user/profile')}>
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>

          {showOptions.myprofile && (
            <div className="dropdown-right">
              <button onClick={() => handleSelectOption("/user/profile", "myprofile")}>
                My Account
              </button>
              <button onClick={() => signOut()}>Logout</button>
            </div>
          )}
        </div>
      }

    </div>
  );
}
