import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PreviewMapChild from "./PreviewMapChild";
import axios from "axios";
import BrowserCoords from "./util_functions/GetBrowserLocation";
import { map } from "leaflet";
import { useAuth } from "./Context/AuthContext";

export default function PreviewMap({ refresh, mapId, setMapId }) {


  const { user, logInUser, logInAdmin, logOut } = useAuth();

  // console.log("user", user)

  const [coords, setCoords] = useState([
    [49.283255, -123.119930]
  ]);


  //Get map
  // const [mapId, setMapId] = useState(null)
  const [mapTitle, setMapTitle] = useState(null)
  const [mapCreatedBy, setMapCreatedBy] = useState(null)
  // let idObject = useParams();
  // let id = Number(Object.values(idObject)[0])
  let id = mapId;

  // console.log("id in see map", id)

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




  const getMapPoints = async () => {
    try {
      const response = await axios.get(`http://localhost:3500/points/${id}`);

      // console.log("getMapPoints res.data", response.data)

      // const responseData = Object.values(response.data)[0]
      // console.log("responseData", responseData)

      setPoints(response.data)
      setLoading(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    getMapPoints();


  }, [refresh, mapId])

  useEffect(() => {
    // console.log("coords", coords)

  }, [coords, mapId])



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
      {user.loggedIn && (
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
  )
}