import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeeMapChild from "./SeeMapChild";
import axios from "axios";
import BrowserCoords from "./util_functions/GetBrowserLocation";

export default function SeeMap() {
  const [mapId, setMapId] = useState(null);
  const [mapTitle, setMapTitle] = useState(null);
  const [mapCreatedBy, setMapCreatedBy] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [coords, setCoords] = useState([
    [49.283255, -123.119930]
  ]);


  useEffect(() => {
    const getMapPoints = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${id}`);
        setPoints(response.data);
        setLoading(true);
      } catch (err) {
        console.error(err);
        // Handle error (e.g., show error message)
      }
    };
  
    const getMap = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/maps/${id}`);
        const responseData = Object.values(response.data)[0];
        setMapId(responseData.id);
        setMapTitle(responseData.title);
        setMapCreatedBy(responseData.createdby);
      } catch (err) {
        console.error(err);
        // Handle error (e.g., show error message)
      }
    };
  
    getMapPoints();
    getMap();
  
  }, [id]); // Assuming id is the only external dependency
  

  let rideCoords = [BrowserCoords];


  if (loading) {
    points.forEach((point) => {
      rideCoords.push(Object.values(point));
    });
  }

  return (
    <div>
      <SeeMapChild
        coords={coords}
        setCoords={setCoords}
        rideCoords={rideCoords}
        mapId={mapId}
        mapTitle={mapTitle}
        mapCreatedBy={mapCreatedBy}
      />
    </div>
  );
}
