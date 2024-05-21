import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../styles/Title.css'

// Component for non-touch devices
function TitleNonTouch({ showUn, toggleShowUn }) {
  const [hover, setHover] = useState(false);

useEffect(() => {
  // console.log("hover", hover)
}, [hover])

  const handleHover = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div
      className="title-modify"
      onClick={toggleShowUn}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {hover ? (showUn ? 'UN' : 'IDE') : (showUn ? 'IDE' : 'UN')}
    </div>
  );
}

// Component for touch devices
function TitleTouch({ showUn, toggleShowUn }) {
  return (
    <div className="title-modify" onClick={toggleShowUn}>
      {!showUn ? 'UN' : 'IDE'}
    </div>
  );
}

export default function Title({ rideApp, setRideApp }) {
  const navigate = useNavigate();
  const [showUn, setShowUn] = useState(rideApp); //Before "true"

// console.log("rideApp in Title", rideApp)

  const toggleShowUn = () => {
    setShowUn(!showUn);
    setRideApp(!rideApp);
    if (showUn) {
      navigate("/runs/public");
    } else {
      navigate("/rides/public");
    }
  };


  return (
    <div className="container">
      <div style={{ display: 'inline-block' }}>R</div>
      {('ontouchstart' in window || navigator.maxTouchPoints) ? (
        <TitleTouch showUn={showUn} toggleShowUn={toggleShowUn} />
      ) : (
        <TitleNonTouch showUn={showUn} toggleShowUn={toggleShowUn} />
      )}
      <div>WITH</div>
      <div>ME</div>
    </div>
  );
}
