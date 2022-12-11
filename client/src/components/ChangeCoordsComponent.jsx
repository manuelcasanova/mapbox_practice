import { useState, useEffect } from "react";
import ChangeCoordsComponentChild from "./ChangeCoordsComponentChild";
import axios from "axios";

export default function ChangeCoordsComponent () {

let latitude;
let longitude;

  navigator.geolocation.getCurrentPosition(function(location) {
    latitude = location.coords.latitude
    longitude = location.coords.longitude

    console.log(location.coords.latitude);
    console.log(location.coords.longitude);
    console.log("coordinadas", [latitude, longitude])
  
});




  const [coords, setCoords] = useState([
     [51.52167056034225, -0.12894469488176763]
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
    // console.log("points", points)
   
  }, [points])

  let rideCoords = []

  {
    loading && points.map((point) => {
      // latitudesArray.push(Number(point.lat))
      // longitudesArray.push(Number(point.lng))
      // console.log("Obj values", Object.values(point))
      rideCoords.push(Object.values(point))
      
    })
  }

  // console.log("rideCoords", rideCoords)


  // console.log("arrays", latitudesArray, longitudesArray)
  



  /////GET COORDIANTES - END

  return (
    <div       onClick={() =>
      setCoords(rideCoords)
    }>
    {/* <div> */}
    <ChangeCoordsComponentChild coords={coords} />
    <button
      onClick={() =>
        setCoords(rideCoords)
      }
    >
      Center ride
    </button>
  </div>
  )
}