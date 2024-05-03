import React, { useState, useEffect } from 'react';

function IsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints);
    console.log("istouchdevice", isTouchDevice)
  }, []);


  return (
    <div>
      {isTouchDevice ? (
        <p>Touchscreen device detected.</p>
      ) : (
        <p>Desktop or non-touchscreen device detected.</p>
      )}
    </div>
  );
}

export default IsTouchDevice;
