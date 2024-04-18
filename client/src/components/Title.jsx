//Hooks
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Title() {

  const navigate = useNavigate()
  const [showUn, setShowUn] = useState(false);

  const [hover, setHover] = useState(false);

  const handleHover = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleClick = () => {
    setShowUn(!showUn);
    if (showUn) {
      navigate("/run");
    } else {
      navigate("/");
    }
  };

  return (
<div className="container">
      <div style={{ display: 'inline-block' }}>R</div>
      <div
        className="title-modify"
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        {hover ? (showUn ? 'UN' : 'IDE') : (showUn ? 'IDE' : 'UN')}
      </div>
      <div>WITH</div>
      <div>ME</div>
    </div>
  );
}