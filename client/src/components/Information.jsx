//Hooks
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

export default function
  Information({ setFromButton }) {
    
  const navigate = useNavigate()
  const { user } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-public">
        <button className="navbar_button"
          onClick={() => navigate("/maps/create")}
        >Create a map</button>
        <button className="navbar_button"
          onClick={() => {
            setFromButton(true);
            navigate("/maps");
          }}
        >Manage my maps</button>
        <button className="navbar_button"
          onClick={() => navigate("/ride")}
        >Create ride</button>
        <button className="navbar_button"
          onClick={() => navigate("/rides/public")}
        >See public rides</button>
        <button className="navbar_button"
          onClick={() => navigate("/rides/mine")}
        >See my rides</button>
      </div>

      {user.isAdmin &&
        <div className="admin-navbar">
          <button className="navbar_button"
          onClick={() => navigate("/rides/all")}
          >Admin rides</button>
          <button className="navbar_button"
          // onClick={() => navigate("/rides/mine")}
          >Admin users</button>
          <button className="navbar_button"
          // onClick={() => navigate("/rides/mine")}
          >Admin maps</button>
        </div>
      }

    </div>
  )
}