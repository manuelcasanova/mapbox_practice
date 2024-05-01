import { useNavigate } from "react-router-dom";

export default function Welcome({handleSetRideApp}) {


  const navigate = useNavigate();

  return (
    <>
      <div>Ready to seize the day?</div>
      <div>
        <button
        onClick={() => {
          handleSetRideApp()
          navigate("/rides");

        }}
        >Ride with me</button>
        <div>or</div>
        <button
        onClick={() => {
          handleSetRideApp()
          navigate("/run");

        }}>Run with me</button>
      </div>
    </>
  )
}