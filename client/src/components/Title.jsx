//Hooks
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Title({rideApp, setRideApp}) {

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints);
  }, []);

  // console.log(isTouchDevice)

  const navigate = useNavigate()
  const [showUn, setShowUn] = useState(true);

  const [hover, setHover] = useState(false);

  const handleHover = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleClick = () => {
    setShowUn(!showUn);
    setRideApp(!rideApp)
    if (showUn) {
      navigate("/run");
    } else {
      navigate("/rides");
    }
  };

  return (
    <>
    <div>{isTouchDevice ? <>Touch</> : <>No touch</>}</div>
    <div className="container">
      <div style={{ display: 'inline-block' }}>R</div>


{!isTouchDevice ? (
      <div
        className="title-modify"
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {hover ? (showUn ? 'UN' : 'IDE') : (showUn ? 'IDE' : 'UN')}
      </div>

 ) : (

  <div
  className="title-modify"
  onClick={handleClick}
  // onMouseEnter={handleHover}
  // onMouseLeave={handleMouseLeave}
>
  {!showUn ? 'UN' : 'IDE'}
</div>

)}


      <div>WITH</div>
      <div>ME</div>
    </div>
    </>
  );
  
}