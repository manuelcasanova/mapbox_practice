//Hooks
import { useNavigate } from "react-router-dom";

export default function
  Information() {

  const navigate = useNavigate()

  return (
    <div className="information">
      <button className="navbar_button"
        onClick={() => navigate("/maps")}
      >Manage maps</button>
            <button className="navbar_button"
        onClick={() => navigate("/ride")}
      >Manage rides</button>

    </div>
  )
}