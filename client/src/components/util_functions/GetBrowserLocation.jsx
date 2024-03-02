import React, { useState, useEffect, createContext, useContext } from "react";

const CoordsContext = createContext(); // Create a context

export const useCoords = () => useContext(CoordsContext); // Custom hook to use the context

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


// import { useState, useEffect } from "react";

// export let browCoords = [49.283255, -123.119930]; // Exporting browCoords

// export default function BrowserCoords() {
//   const [browCoordsInternal, setBrowCoordsInternal] = useState([49.283255, -123.119930]);

//   useEffect(() => {
//     const options = {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0
//     };

//     const success = (pos) => {
//       const crd = pos.coords;
//       setBrowCoordsInternal([crd.latitude, crd.longitude]);
//     };

//     const error = (err) => {
//       console.warn(`ERROR(${err.code}): ${err.message}`);
//     };

//     const watchId = navigator.geolocation.getCurrentPosition(
//       success,
//       error,
//       options
//     );

//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//     };
//   }, []);

//   // Updating the exported variable
//   browCoords = browCoordsInternal;

//   return null; // Since we don't render anything directly in this component
// }




// import { useState, useEffect } from "react";

// export default function BrowserCoords() {
//   const [browCoords, setBrowCoords] = useState([49.283255, -123.119930]);

//   useEffect(() => {
//     const options = {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0
//     };

//     const success = (pos) => {
//       const crd = pos.coords;
//       setBrowCoords([crd.latitude, crd.longitude]);
//       console.log("Current coordinates:", [crd.latitude, crd.longitude]);
//     };

//     const error = (err) => {
//       console.warn(`ERROR(${err.code}): ${err.message}`);
//     };

//     const watchId = navigator.geolocation.getCurrentPosition(
//       success,
//       error,
//       options
//     );

//     return () => {
//       // Cleanup: Clear the watch when the component unmounts
//       navigator.geolocation.clearWatch(watchId);
//     };
//   }, []); // Empty dependency array ensures the effect runs only once after initial render

//   // console.log("browCoords", browCoords);


// }


// import { useState } from "react";



// export default function BrowserCoords () {

//   const [browCoords, setBrowCoords] = useState([49.283255, -123.119930])

//   console.log("browCoords", browCoords)

//   const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   };
  
//   function success(pos) {
//     const crd = pos.coords;
//     setBrowCoords([crd.latitude, crd.longitude])
  
//   }
  
//   function error(err) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//   }
  
//   navigator.geolocation.getCurrentPosition(success, error, options);


// }


