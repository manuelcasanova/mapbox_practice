//Hooks
import { useNavigate } from "react-router-dom";

export default function Title () {

  const navigate = useNavigate()
  
  return (
    <div className="title"
    onClick={() => navigate("/")}>
      Ride with me
    </div>
  )
}