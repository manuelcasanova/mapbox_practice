import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord}) {

  

  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        setCoord([...res.data])
        // console.log("res data", res.data)
        // console.log("coord", coord)
      })
  }, [])

  useMapEvents({
    click: (e) => {
      setCoord([...coord, e.latlng]);
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
      // console.log("e", e)
      // console.log("type of e.latlng", typeof e.latlng)
      // console.log("e.latlng", e.latlng)
      // console.log("values", Object.values(e.latlng))
      setRemovePoint(prevState => !prevState)
    }
  });

  useEffect(() => {
    // console.log("coord", coord);
  }, [coord]);

  const removeMarker = (pos) => {
    // console.log("pos", pos)
    setCoord((prevCoord) =>
      prevCoord.filter((coord) => JSON.stringify(coord) !== JSON.stringify(pos))
    );
    axios.post(`http://localhost:3500/points/delete/`, pos)
      .then((response) => {
        // console.log(response.data)
      })
    setRemovePoint(prevState => !prevState)
  };

  return (
    <div>
      {coord.map((pos, idx) => (
        <Marker
          key={`marker-${idx}`}
          position={pos}
          // draggable={true}
          eventHandlers={{
            click: (e) => {
              // console.log(e.latlng);
              removeMarker(pos)
            }
          }}
        >
          {/* <Popup>
            <button onClick={() => removeMarker(pos)}>Remove marker</button>
          </Popup> */}
        </Marker>
      ))}
    </div>
  );
}