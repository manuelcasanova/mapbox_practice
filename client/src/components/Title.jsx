//Hooks
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Title() {

  const navigate = useNavigate()
  const [showUn, setShowUn] = useState(false);

  const handleClick = () => {
    setShowUn(!showUn);
    if (showUn) {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
<div className="container">
<div style={{ display: 'inline-block' }}>R</div>
      <div
      className="title-modify"
      onClick={handleClick}>
        {showUn ? 'UN' : 'IDE'}
      </div>
      <div>WITH</div>
      <div>ME</div>
    </div>
  );
}