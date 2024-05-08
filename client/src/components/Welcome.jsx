import { useNavigate } from "react-router-dom";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"

export default function Welcome({rideApp, handleSetRideApp, handleSetRunApp}) {

  const { auth } = useAuth();
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
          navigate("/login");

        }}
        >Ride with me</button>
        <div>or</div>
        <button
        onClick={() => {
          if (!rideApp) {
          handleSetRunApp()
        }
          navigate("/login");

        }}>Run with me</button>
      </div>
    </>
  )
}