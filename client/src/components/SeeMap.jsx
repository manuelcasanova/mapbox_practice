import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeeMapChild from "./SeeMapChild";
import axios from "axios";
import BrowserCoords from "./util_functions/GetBrowserLocation";

export default function SeeMap ({refresh})  {


  const [coords, setCoords] = useState([
     [49.283255, -123.119930]
  ]);


  //Get map
  const [mapId, setMapId] = useState(null)
  const [mapTitle, setMapTitle] = useState(null)
  const [mapCreatedBy, setMapCreatedBy] = useState(null)
  let idObject = useParams();
  let id = Number(Object.values(idObject)[0])

  const getMap = async () => {

    try {
      const response = await axios.get(`http://localhost:3500/maps/${id}`);

const responseData = Object.values(response.data)[0]

setMapId(responseData.id)
setMapTitle(responseData.title)
setMapCreatedBy(responseData.createdby)

// console.log("responseData", responseData)
   
    } catch (err) {
      console.error(err)
    }
  }

  

  /////GET COORDINATES

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);


  const getPoints = async () => {
    try {
      const response = await axios.get('http://localhost:3500/points');
      console.log("getPoints res.data", response.data)
      setPoints(response.data)
      setLoading(true)
    } catch (err) {
      console.error(err)
    }
  }



  useEffect(() => {

  
    getPoints();
    getMap();

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
    <SeeMapChild 
    coords={coords} 
    setCoords={setCoords} 
    rideCoords={rideCoords}
    mapId = {mapId}
    mapTitle = {mapTitle}
    mapCreatedBy = {mapCreatedBy}
    />
  </div>
  )
}