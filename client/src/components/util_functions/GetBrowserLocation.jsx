import React, { useState, useEffect, createContext, useContext } from "react";

const CoordsContext = createContext();

export const useCoords = () => useContext(CoordsContext); 

export default function GetBrowserLocation({ children }) {
  const [browCoords, setBrowCoords] = useState([49.283255, -123.119930]);

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos) => {
      const crd = pos.coords;
      setBrowCoords([crd.latitude, crd.longitude]);
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    const watchId = navigator.geolocation.getCurrentPosition(
      success,
      error,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <CoordsContext.Provider value={{browCoords}}>
      {children}
    </CoordsContext.Provider>
  );
}
