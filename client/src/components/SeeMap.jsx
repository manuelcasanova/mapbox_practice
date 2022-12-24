import { useState, useEffect } from "react";
import SeeMapChild from "./SeeMapChild";
import axios from "axios";
import BrowserCoords from "./util_functions/GetBrowserLocation";

export default function SeeMap ({refresh})  {

let latitude;
let longitude;

  navigator.geolocation.getCurrentPosition(function(location) {
    latitude = location.coords.latitude
    longitude = location.coords.longitude
});


  const [coords, setCoords] = useState([
     [49.283255, -123.119930]
  ]);


  /////GET COORDINATES

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);


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

  }, [refresh])

  useEffect(() => {
    //  console.log("coords", coords)
   
  }, [coords])


  let rideCoords = [BrowserCoords]

  {
    loading && points.map((point) => {
      rideCoords.push(Object.values(point))
      
    })
  }
  /////GET COORDIANTES - END


  return (
    //Ride is shown centered in map
    <div>
    <SeeMapChild coords={coords} setCoords={setCoords} rideCoords={rideCoords}  />
  </div>
  )
}