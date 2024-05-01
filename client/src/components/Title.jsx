import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Component for non-touch devices
function TitleNonTouch({ showUn, toggleShowUn }) {
  const [hover, setHover] = useState(false);

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

  const toggleShowUn = () => {
    setShowUn(!showUn);
    setRideApp(!rideApp);
    if (showUn) {
      navigate("/run");
    } else {
      navigate("/rides");
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
