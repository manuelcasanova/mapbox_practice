import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeeMapChild from "./SeeMapChild";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BrowserCoords from "./util_functions/GetBrowserLocation";
import useAuth from "../hooks/useAuth"

export default function SeeMap() {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [mapId, setMapId] = useState(null);
  const [mapTitle, setMapTitle] = useState(null);
  const [mapCreatedBy, setMapCreatedBy] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate()

  const [coords, setCoords] = useState([
    [48.858093, 2.294694]
  ]);


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

    const getMap = async () => {
      try {
        const response = await axiosPrivate.get(`${BACKEND}/maps/${id}`);
        const responseData = Object.values(response.data)[0];
        setMapId(responseData.id);
        setMapTitle(responseData.title);
        setMapCreatedBy(responseData.createdby);
      } catch (err) {
        console.error(err);
      }
    };

    getMapPoints();
    getMap();

  }, [id]);


  let rideCoords = [BrowserCoords];


  if (loading) {
    points.forEach((point) => {
      rideCoords.push(Object.values(point));
    });
  }

  return (

    <>
      {auth.accessToken !== undefined ? (
        mapId !== null && mapId !== undefined ? (
          <SeeMapChild
            coords={coords}
            setCoords={setCoords}
            rideCoords={rideCoords}
            mapId={mapId}
            mapTitle={mapTitle}
            mapCreatedBy={mapCreatedBy}
          />
        ) : (
          <div>Map with id {id} does not exist or cannot be rendered.</div>
        )
      ) : (
        <>Log in to see the map</>
      )}
    </>


  );

}
