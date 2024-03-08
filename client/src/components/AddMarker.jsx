import { useEffect, useCallback } from "react";
import { Marker, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, mapId, defaultPosition}) {

  const icon_black = L.icon({
    iconSize: [2, 2],
    iconAnchor: [0, 0],
    popupAnchor: [2, -40],
    iconUrl: require('../components/img/black-square.png'),
  });

  const icon_green = L.icon({
    iconSize: [30, 30],
    iconUrl: require('../components/img/greencircle.png'),
  });

  const icon_flag = L.icon({
    iconSize: [20, 20],
    iconUrl: require('../components/img/raceflag.png'),
  });

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
      const { lat, lng } = e.latlng;
      const newCoordinate = { lat, lng, timestamp: Date.now() };
      setCoord([...coord, newCoordinate]);
      saveMarkers([lat, lng]);
      setRemovePoint(prevState => prevState + 1)
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
