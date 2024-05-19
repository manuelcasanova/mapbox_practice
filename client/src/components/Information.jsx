import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";




export default function Information({ setFromButton, rideApp, setRideAppUndefined }) {

  // console.log("rideApp in Information", rideApp)
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const signOut = async () => {
    await logout();
    setRideAppUndefined()
    navigate('/');
  }

  // console.log("auth in Information.jsx", auth)

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
      {Object.keys(auth).length
        ?
        <>
          <div>Logged in as: {auth.username} </div>
          <button onClick={() => signOut()}>Logout</button>
        </>
        :
        <button onClick={() => navigate('/login')}>Login</button>
      }


      <div className="navbar-public">
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter("ride")}
          onMouseLeave={() => handleMouseLeave("ride")}
        >
          <button onClick={() => handleMouseEnter(rideApp ? "ride" : "run")}>
            {rideApp ? "Rides" : "Runs"}
          </button>


          {rideApp && showOptions.ride && (
            <div className="dropdown">
              <button onClick={() => handleSelectOption("/rides/public", "ride")}>See rides</button>
              <button onClick={() => handleSelectOption("/rides/mine", "ride")}>See my rides</button>
              <button onClick={() => handleSelectOption("/ride", "ride")}>Create ride</button>
            </div>
          )}


          {!rideApp && showOptions.ride && (
            <div className="dropdown">
              <button onClick={() => handleSelectOption("/runs/public", "ride")}>See runs</button>
              <button onClick={() => handleSelectOption("/runs/mine", "ride")}>See my runs</button>
              <button onClick={() => handleSelectOption("/run", "ride")}>Create run</button>
            </div>
          )}



        </div>

        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter("map")}
          onMouseLeave={() => handleMouseLeave("map")}
        >
          <button onClick={() => handleMouseEnter("map")}>Maps</button>
          {showOptions.map && (
            <div className="dropdown">
              <button onClick={() => handleSelectOption("/maps/public", "map")}>See maps</button>
              <button onClick={() => handleSelectOption("/maps", "map")}>Manage my maps</button>
              <button onClick={() => handleSelectOption("/maps/create", "map")}>Create a map</button>
            </div>
          )}
        </div>

        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter("user")}
          onMouseLeave={() => handleMouseLeave("user")}
        >
          <button onClick={() => handleMouseEnter("user")}>Users</button>
          {showOptions.user && (
            <div className="dropdown">
              <button onClick={() => handleSelectOption("/users/all", "user")}>Users</button>
              <button onClick={() => handleSelectOption("/users/followee", "user")}>Following</button>
              <button onClick={() => handleSelectOption("/users/followers", "user")}>Followers</button>
              <button onClick={() => handleSelectOption("/users/pending", "user")}>Request Pending</button>
              <button onClick={() => handleSelectOption("/users/muted", "user")}>Muted</button>
            </div>
          )}
        </div>

        {auth &&
          <div className="dropdown-wrapper">
            <button onClick={() => navigate('/user/profile')}>My account</button></div>
        }
      </div>

      {auth && auth.isAdmin && (
        <div className="admin-navbar">
          <div
            className="dropdown-wrapper"
            onMouseEnter={() => handleMouseEnter("admin")}
            onMouseLeave={() => handleMouseLeave("admin")}
          >
            <button onClick={() => () => handleMouseEnter("admin")}>Admin</button>
            {showOptions.admin && (
              <div className="dropdown">


                {rideApp ? <button onClick={() => handleSelectOption("/rides/all", "admin")}>Admin rides</button> : <button onClick={() => handleSelectOption("/runs/all", "admin")}>Admin runs</button>}

                <button onClick={() => handleSelectOption("/users/admin", "admin")}>Admin users</button>

                {rideApp ?
                  <button onClick={() => handleSelectOption("/rides/messages/reported", "admin")}>Reported messages</button>
                  :
                  <button onClick={() => handleSelectOption("/runs/messages/reported", "admin")}>Reported messages</button>
                }


              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
