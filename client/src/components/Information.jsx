//Hooks
import { useNavigate } from "react-router-dom";

export default function
  Information() {

  const navigate = useNavigate()

  return (
    <div className="information">
      <button className="navbar_button"
        onClick={() => navigate("/newmap")}
      >Create new map</button>

    </div>
  )
}