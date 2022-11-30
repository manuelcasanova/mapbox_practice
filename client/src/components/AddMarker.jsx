import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

export default function AddMarker({saveMarkers}) {
  const [coord, setPosition] = useState([]);

  useMapEvents({
    click: (e) => {
      setPosition([...coord, e.latlng]);
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
    }
  });

  useEffect(() => {
    console.log(coord);
  }, [coord]);

  const removeMarker = (pos) => {
    setPosition((prevCoord) =>
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