import { useNavigate } from "react-router-dom";


export default function Welcome({rideApp, handleSetRideApp, handleSetRunApp}) {

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