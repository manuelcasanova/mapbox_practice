import { useState, useEffect } from "react";
import PreviewMapChild from "./PreviewMapChild";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BrowserCoords from "./util_functions/GetBrowserLocation";
import useAuth from "../hooks/useAuth"
import GetBrowserLocation from "./util_functions/GetBrowserLocation";



export default function PreviewMap({ mapId }) {
  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuth();


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
        const responseData = Object.values(response.data)[0]

        setMapTitle(responseData?.title)
        setMapCreatedBy(responseData?.createdby)

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (mapId) {
      getMap();
    }

    return () => {
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


  }, [coords, mapId])



  let rideCoords = [BrowserCoords]

  loading && points.map((point) => {
    rideCoords.push(Object.values(point))
    return null
  })


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