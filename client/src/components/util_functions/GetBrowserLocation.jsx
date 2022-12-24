import { useState } from "react";



export default function BrowserCoords () {

  const [browCoords, setBrowCoords] = useState([49.283255, -123.119930])

  // console.log("browCoords", browCoords)

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    const crd = pos.coords;
    setBrowCoords([crd.latitude, crd.longitude])
  
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);


}


