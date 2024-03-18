import { useEffect, useCallback } from "react";
import { Marker, useMapEvents, Polyline } from "react-leaflet";
import axios from "axios";
import { icon_black, icon_green, icon_flag } from "./img/Icons";
import { useAuth } from "./Context/AuthContext";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, mapId, defaultPosition, maps, setEditAllowed}) {



  const { user } = useAuth();
  const fetchData = useCallback(() => {
    axios.get(`http://localhost:3500/points/${mapId}`)
      .then(function (res) {
        setCoord([...res.data])
      })
      .catch(function (error) {
        console.error('Error fetching points data:', error);
      });
  }, [mapId, setCoord]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useMapEvents({
    click: (e) => {
      if (maps && user.id === maps[0].createdby) {
      const { lat, lng } = e.latlng;
      const newCoordinate = { lat, lng, timestamp: Date.now() };
      setCoord([...coord, newCoordinate]);
      saveMarkers([lat, lng]);
      setRemovePoint(prevState => prevState + 1);
      setEditAllowed(false)
      } else {
        console.log("You are not authorized to add markers to this map.");
      }
    }
  });

  const sortedCoordinates = [...coord].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      {sortedCoordinates.map((pos, index) => (
        <Marker
          key={`marker-${index}`}
          position={pos}
          icon={
            index === 0 ? icon_green : index === coord.length - 1 ? icon_flag : icon_black 
          }
          eventHandlers={{
            click: (e) => {
              // Handle click event if needed
            }
          }}
        />
      ))}
      
      <Polyline positions={sortedCoordinates.map(pos => [pos.lat, pos.lng])} pathOptions={{ color: "black" }}/>
    </div>
  );
}
