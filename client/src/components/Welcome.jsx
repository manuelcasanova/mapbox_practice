import { useNavigate } from "react-router-dom";
import '../styles/Welcome.css'

export default function Welcome({rideApp, handleSetRideApp, handleSetRunApp}) {

  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-question">Ready to seize the day?</div>
      <div className="welcome-buttons">
        <button className="welcome-button-one"
        onClick={() => {
          if (!rideApp) {
          handleSetRideApp()
        }
          navigate("/login");

        }}
        >RIDE WITH ME</button>
        <div className="welcome-or">or</div>
        <button className="welcome-button-two"
        onClick={() => {
          if (!rideApp) {
          handleSetRunApp()
        }
          navigate("/login");

        }}>RUN WITH ME</button>
      </div>
    </div>
  )
}