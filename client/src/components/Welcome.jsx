import { useNavigate } from "react-router-dom";

export default function Welcome() {


  const navigate = useNavigate();

  return (
    <>
      <div>Ready to seize the day?</div>
      <div>
        <button
        onClick={() => {
          navigate("/ride");

        }}
        >Ride with me</button>
        <div>or</div>
        <button
        onClick={() => {
          navigate("/run");

        }}>Run with me</button>
      </div>
    </>
  )
}