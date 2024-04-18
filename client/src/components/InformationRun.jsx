import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./Context/AuthContext";

export default function InformationRun({ setFromButton }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedMapOption, setSelectedMapOption] = useState("/maps/public");
  const [selectedRunOption, setSelectedRunOption] = useState("/");
  const [selectedUserOption, setSelectedUserOption] = useState("/users/all");

  const handleMapSelectOption = (event) => {
    const route = event.target.value;
    setSelectedMapOption(route);
    navigate(route);
  };

  const handleRideSelectOption = (event) => {
    const route = event.target.value;
    setSelectedRunOption(route);
    navigate(route);
  };

  const handleUserSelectOption = (event) => {
    const route = event.target.value;
    setSelectedUserOption(route);
    navigate(route);
  };

  return (
    <div className="navbar">
      <div className="navbar-public">
        <select
          value={selectedRunOption}
          onChange={handleRideSelectOption}
          onClick={handleRideSelectOption}
        >
          <option value="/run">See runs</option>
          <option value="/run">See my runs</option>
          <option value="/run">Create run</option>
        </select>

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
            onChange={(e) => navigate(e.target.value)}>
            onClick={handleUserSelectOption}
            <option value="/">Admin rides</option>
            <option value="/">Admin maps</option>
            <option value="/">Admin users</option>
          </select>
        </div>
      )}

    </div>
  );
}
