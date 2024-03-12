//Hooks
import { useNavigate } from "react-router-dom";

export default function
  Information({setFromButton}) {

  const navigate = useNavigate()
  const fromButton = true;

  return (
    <div className="information">
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
        onClick={() => navigate("/ride/all")}
      >See all rides</button>
      <button className="navbar_button"
        onClick={() => navigate("/ride/mine")}
      >See my rides</button>
    </div>
  )
}