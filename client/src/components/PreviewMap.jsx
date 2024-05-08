import { useState, useEffect } from "react";
import PreviewMapChild from "./PreviewMapChild";
import axios from "axios";
import BrowserCoords from "./util_functions/GetBrowserLocation";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import GetBrowserLocation from "./util_functions/GetBrowserLocation";



export default function PreviewMap({ mapId }) {

// console.log("mapId in PreviewMap", mapId)
  const { auth } = useAuth();

  //  console.log("auth.accessToken", auth.accessToken)

  const [coords, setCoords] = useState([
    [49.283255, -123.119930]
  ]);


  //Get map
  const [mapTitle, setMapTitle] = useState(null)
  const [mapCreatedBy, setMapCreatedBy] = useState(null)
  let id = mapId;

  const getMap = async () => {

    try {
      const response = await axios.get(`http://localhost:3500/maps/${id}`);

      const responseData = Object.values(response.data)[0]

      setMapTitle(responseData?.title)
      setMapCreatedBy(responseData?.createdby)

    } catch (err) {
      console.error(err)
    }
  }

  getMap()

  /////GET COORDINATES

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getMapPoints = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${id}`);
        setPoints(response.data);
        setLoading(true);
      } catch (err) {
        console.error(err);
      }
    };
  
    getMapPoints();
  }, [mapId, id]);

  useEffect(() => {
    //  console.log("coords", coords)

  }, [coords, mapId])



  let rideCoords = [BrowserCoords]

    loading && points.map((point) => {
      rideCoords.push(Object.values(point))
return null
    })
  
// console.log("rideCOords in PM", rideCoords)

  /////GET COORDIANTES - END


  return (
    //Ride is shown centered in map
    <GetBrowserLocation>
    <div>
      {auth.accessToken !== undefined && mapId && mapId !== null && mapId !== undefined && (
        <PreviewMapChild
          coords={coords}
          setCoords={setCoords}
          rideCoords={rideCoords}
          mapId={mapId}
          mapTitle={mapTitle}
          mapCreatedBy={mapCreatedBy}
        />
 
      )}
    </div>
    </GetBrowserLocation>
  )
}