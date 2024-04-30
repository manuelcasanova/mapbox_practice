import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./Context/AuthContext";

export default function Information({ setFromButton, rideApp }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedMapOption, setSelectedMapOption] = useState("/maps/public");
  const [selectedRideOption, setSelectedRideOption] = useState("/rides/public");
  const [selectedRunOption, setSelectedRunOption] = useState("/");
  const [selectedUserOption, setSelectedUserOption] = useState("/users/all");
  const [selectedAdminOption, setSelectedAdminOption] = useState("/rides/all");


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

  const handleAdminSelectOption = (event) => {
    const route = event.target.value;
    setSelectedAdminOption(route);
    navigate(route);
  };


  // useEffect(() => {
  //   navigate(selectedRideOption);
  // }, [navigate, selectedRideOption]);


  return (
    <div className="navbar">
      <div className="navbar-public">

        {rideApp && 
        <select
          value={selectedRideOption}
          onChange={handleRideSelectOption}
          onClick={handleRideSelectOption}
        >
          <option value="/rides/public">See rides</option>
          <option value="/rides/mine">See my rides</option>
          <option value="/ride">Create ride</option>
        </select>
      }

{!rideApp && 
        <select
          value={selectedRunOption}
          onChange={handleRideSelectOption}
          onClick={handleRideSelectOption}
        >
          <option value="/run">See runs</option>
          <option value="/run">See my runs</option>
          <option value="/run">Create run</option>
        </select>
}

        <select
          value={selectedMapOption}
          onChange={handleMapSelectOption}
          onClick={handleMapSelectOption}
        >
          <option value="/maps/public">See maps</option>
          <option value="/maps">Manage my maps</option>
          <option value="/maps/create">Create a map</option>
        </select>

        <select
          value={selectedUserOption}
          onChange={handleUserSelectOption}
          onClick={handleUserSelectOption}
        >
          <option value="/users/all">Users</option>
          <option value="/users/followee">Following</option>
          <option value="/users/followers">Followers</option>
          <option value="/users/pending">Request Pending</option>
          <option value="/users/muted">Muted</option>
        </select>
      </div>

      {user.isAdmin && (
        <div className="admin-navbar">
          <select
          value={selectedAdminOption}
          onChange={handleAdminSelectOption}
          onClick={handleAdminSelectOption}>
            <option value="/rides/all">Admin rides</option>
            <option value="/">Admin users</option>
          </select>
        </div>
      )}

    </div>
  );
}
