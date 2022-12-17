import { useState, useEffect } from "react";
import ChangeCoordsComponentChild from "./ChangeCoordsComponentChild";
import axios from "axios";

export default function ChangeCoordsComponent () {

let latitude;
let longitude;

  navigator.geolocation.getCurrentPosition(function(location) {
    latitude = location.coords.latitude
    longitude = location.coords.longitude

    // console.log(location.coords.latitude);
    // console.log(location.coords.longitude);
    // console.log("coordinadas", [latitude, longitude])
  
});




  const [coords, setCoords] = useState([
     [49.283255, -123.119930]
    //[latitude, longitude]
  ]);


  /////GET COORDINATES

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);

  let latitudesArray = []
  let longitudesArray = []


  const [bounds, setBounds] = useState([])


  const getPoints = async () => {
    try {
      const response = await axios.get('http://localhost:3500/points');
      setPoints(response.data)
      setLoading(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    getPoints();

  }, [])

  useEffect(() => {
    //  console.log("coords", coords)
   
  }, [coords])

  const [browserCoords, setBrowserCoords] = useState([49.283255, -123.119930])


  //Function to get browser location

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    const crd = pos.coords;
  
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    setBrowserCoords([crd.latitude, crd.longitude])

  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);

    //END Function to get browser location

  //If there were no ride coords, the map would center here.
  let rideCoords = [browserCoords]


  {
    loading && points.map((point) => {
      // latitudesArray.push(Number(point.lat))
      // longitudesArray.push(Number(point.lng))
      // console.log("Obj values", Object.values(point))
      rideCoords.push(Object.values(point))
      
    })
  }
  /////GET COORDIANTES - END


  return (
    //Ride is shown centered in map
    <div  
    //Remove because otherwise it shows the line connecting the current location with the first point     
    // onMouseOver={() =>
    //   setCoords(rideCoords)
    // }
    >
    <ChangeCoordsComponentChild coords={coords} setCoords={setCoords} rideCoords={rideCoords}  />


  </div>
  )
}