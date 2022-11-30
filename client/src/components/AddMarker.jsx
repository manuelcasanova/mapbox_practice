import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";

export default function AddMarker({saveMarkers}) {

  const [coord, setCoord] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        setCoord([...res.data])
        // console.log("res data", res.data)
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
    }
  });

  useEffect(() => {
    // console.log("coord", coord);
  }, [coord]);

  const removeMarker = (pos) => {
    setCoord((prevCoord) =>
      prevCoord.filter((coord) => JSON.stringify(coord) !== JSON.stringify(pos))
    );
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