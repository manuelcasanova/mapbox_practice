//Hooks
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./Context/AuthContext";

export default function
  Information({ setFromButton }) {

  const navigate = useNavigate()
  const { user } = useAuth();

  const [showMapsMenu, setShowMapsMenu] = useState(false);
  const [showRidesMenu, setShowRidesMenu] = useState(false);
  const [showUsersMenu, setShowUsersMenu] = useState(false);

  const handleMapsMenu = () => {
    setShowMapsMenu(!showMapsMenu);
    setShowRidesMenu(false);
    setShowUsersMenu(false);
  };

  const handleRidesMenu = () => {
    setShowRidesMenu(!showRidesMenu);
    setShowMapsMenu(false);
    setShowUsersMenu(false);
  };

  const handleUsersMenu = () => {
    setShowUsersMenu(!showUsersMenu);
    setShowMapsMenu(false);
    setShowRidesMenu(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-public">
        <div className="dropdown">
          <button className="dropbtn" onClick={handleMapsMenu}>Maps</button>
          {showMapsMenu && (
            <div className="dropdown-content">
              <button onClick={() => navigate("/maps/create")}>Create a map</button>
              <button onClick={() => navigate("/maps")}>Manage my maps</button>
              <button onClick={() => navigate("/maps/public")}>See maps</button>
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="dropbtn" onClick={handleRidesMenu}>Rides</button>
          {showRidesMenu && (
            <div className="dropdown-content">
              <button onClick={() => navigate("/ride")}>Create ride</button>
              <button onClick={() => navigate("/rides/public")}>See rides</button>
              <button onClick={() => navigate("/rides/mine")}>See my rides</button>
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="dropbtn" onClick={handleUsersMenu}>Users</button>
          {showUsersMenu && (
            <div className="dropdown-content">
              <button onClick={() => navigate("/users/all")}>Users</button>
              <button onClick={() => navigate("/users/followee")}>Following</button>
              <button onClick={() => navigate("/users/followers")}>Followers</button>
              <button onClick={() => navigate("/users/muted")}>Muted</button>
            </div>
          )}
        </div>
      </div>

      {user.isAdmin &&
        <div className="admin-navbar">
          <button className="navbar_button"
            onClick={() => navigate("/rides/all")}
          >Admin rides</button>
          <button className="navbar_button"
          // onClick={() => navigate("/rides/mine")}
          >Admin maps</button>
          <button className="navbar_button"
            onClick={() => navigate("/users/admin")}
          >Admin users</button>
        </div>
      }

    </div>
  )
}