import { useState, useEffect } from "react";
import ChangeCoordsComponentChild from "./ChangeCoordsComponentChild";
import axios from "axios";

export default function ChangeCoordsComponent () {

  const [coords, setCoords] = useState([
    [51.52167056034225, -0.12894469488176763],
    [46.58635156377568, 2.1796793230151184],
    [40.819721, 14.341111],
    [45.819721, 14.341111]
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
    console.log("points", points)
  }, [points])

  let rideCoords = []

  {
    loading && points.map((point) => {
      // latitudesArray.push(Number(point.lat))
      // longitudesArray.push(Number(point.lng))
      console.log("Obj values", Object.values(point))
      rideCoords.push(Object.values(point))
      
    })
  }

  console.log("rideCoords", rideCoords)


  console.log("arrays", latitudesArray, longitudesArray)
  

  /////GET COORDIANTES - END

  return (
    <>
    <ChangeCoordsComponentChild coords={coords} />
    <button
      onClick={() =>
        setCoords(rideCoords)
      }
    >
      Center ride
    </button>
  </>
  )
}