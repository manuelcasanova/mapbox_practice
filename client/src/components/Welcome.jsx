import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

export default function Welcome({rideApp, handleSetRideApp}) {

  const { user } = useAuth();
  // console.log("user in Welcome", user)
  const navigate = useNavigate();

  return (
    <>
      <div>Ready to seize the day?</div>
      <div>
        <button
        onClick={() => {
          if (!rideApp) {
          handleSetRideApp()
        }
          navigate("/rides");

        }}
        >Ride with me</button>
        <div>or</div>
        <button
        onClick={() => {
          if (rideApp) {
          handleSetRideApp()
        }
          navigate("/run");

        }}>Run with me</button>
      </div>
    </>
  )
}