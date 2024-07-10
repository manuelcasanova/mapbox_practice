import { useState, useEffect } from "react";
import PreviewMapChild from "./PreviewMapChild";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BrowserCoords from "./util_functions/GetBrowserLocation";
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import GetBrowserLocation from "./util_functions/GetBrowserLocation";



export default function PreviewMap({ mapId }) {
// console.log("mapid", mapId)
  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

useEffect(() => {

  const getMap = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`${BACKEND}/maps/${id}`);
// console.log("response.data", response.data)
      const responseData = Object.values(response.data)[0]
      // console.log("responseData", responseData)

      setMapTitle(responseData?.title)
      setMapCreatedBy(responseData?.createdby)

    } catch (err) {
      setError(err.message); // Set error state if request fails
    } finally {
      setIsLoading(false); // Whether success or failure, loading is done
    }
  }

  if (mapId) {
    getMap();
  }

  return () => {
    // Clean up if needed
  };

}, [mapId, id, axiosPrivate, BACKEND])


  /////GET COORDINATES

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getMapPoints = async () => {
      try {
        const response = await axiosPrivate.get(`${BACKEND}/points/${id}`);
        setPoints(response.data);
        setLoading(true);
      } catch (err) {
        console.error(err);
      }
    };
  
    getMapPoints();
  }, [mapId, id, axiosPrivate, BACKEND]);

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


  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    //Ride is shown centered in map
    <GetBrowserLocation>
    <>
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
    </>
    </GetBrowserLocation>
  )
}