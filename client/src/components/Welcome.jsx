import { useNavigate } from "react-router-dom";

export default function Welcome({rideApp, handleSetRideApp}) {


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