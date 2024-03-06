import { useEffect, useState } from "react";
import { Marker, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, setRefresh, mapId, defaultPosition}) {


  //  console.log("coord", coord)
  // console.log("default Position", defaultPosition)
  // console.log("mapId", mapId)
 

  const defaultCoords = [{ lat: String(defaultPosition[0]), lng: String(defaultPosition[1]) }];

  // console.log("default coords", defaultCoords)

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


    // Check if coord is empty before setting it to defaultPosition
    // if (coord.length === 0) {
    //   setCoord([defaultCoords]);
    //   // console.log("coord is empty")
    // }


  useEffect(() => {
    axios.get(`http://localhost:3500/points/${mapId}`)
      .then(function (res) {
        // console.log("res.data", res.data)
        setCoord([...res.data])
      })
      .catch(function (error) {
        console.error('Error fetching points data:', error);
      });
  }, [mapId])



  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const newCoordinate = { lat, lng, timestamp: Date.now() }; // Include timestamp
      setCoord([...coord, newCoordinate]);
      saveMarkers([lat, lng]);
      setRemovePoint(prevState => prevState + 1)
    }
  });

   // Sort coordinates by timestamp
   const sortedCoordinates = [...coord].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      {sortedCoordinates.map((pos, index) => (
       
        
        <Marker
          key={`marker-${index}`}
          position={pos}
          // draggable={true}

          icon={
            index === 0 ? icon_green : index === coord.length - 1 ? icon_flag : icon_black 
          }

          eventHandlers={{
            click: (e) => {
              // console.log(e.latlng);
              // removeMarker(pos)
              // console.log("pos", pos)
            }
          }}
        />
      ))}

<Polyline positions={sortedCoordinates.map(pos => [pos.lat, pos.lng])} pathOptions={{ color: "black" }}/>

    </div>
  );
}