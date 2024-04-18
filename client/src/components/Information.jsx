import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./Context/AuthContext";

export default function Information({ setFromButton }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedMapOption, setSelectedMapOption] = useState("/maps/public");
  const [selectedRideOption, setSelectedRideOption] = useState("/rides/public");
  const [selectedUserOption, setSelectedUserOption] = useState("/users/all");

  const handleMapSelectOption = (event) => {
    const route = event.target.value;
    setSelectedMapOption(route);
    navigate(route);
  };

  const handleRideSelectOption = (event) => {
    const route = event.target.value;
    setSelectedRideOption(route);
    navigate(route);
  };

  const handleUserSelectOption = (event) => {
    const route = event.target.value;
    setSelectedUserOption(route);
    navigate(route);
  };


  // useEffect(() => {
  //   navigate(selectedRideOption);
  // }, [navigate, selectedRideOption]);


  return (
    <div className="navbar">
      <div className="navbar-public">
        <select
          value={selectedMapOption}
          onChange={handleMapSelectOption}
        >
          <option value="/maps/public">MAPS</option>
          <option value="/maps/create">Create a map</option>
          <option value="/maps">Manage my maps</option>
          <option value="/maps/public">See maps</option>
        </select>

        <select
          value={selectedRideOption}
          onChange={handleRideSelectOption}
        >
          <option value="/rides/public">RIDES</option>
          <option value="/ride">Create ride</option>
          <option value="/rides/public">See rides</option>
          <option value="/rides/mine">See my rides</option>
        </select>

        <select
          value={selectedUserOption}
          onChange={handleUserSelectOption}
        >
          <option value="/users/all">USERS</option>
          <option value="/users/all">Users</option>
          <option value="/users/followee">Following</option>
          <option value="/users/followers">Followers</option>
          <option value="/users/muted">Muted</option>
        </select>
      </div>

      {user.isAdmin && (
  <div className="admin-navbar">
    <select onChange={(e) => navigate(e.target.value)}>
    <option value="/">ADMIN</option>
      <option value="/">Admin rides</option>
      <option value="/">Admin maps</option>
      <option value="/">Admin users</option>
    </select>
  </div>
)}

    </div>
  );
}
