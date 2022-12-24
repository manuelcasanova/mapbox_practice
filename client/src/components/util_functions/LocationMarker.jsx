import { useState, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

export default function LocationMarker() {

//Icon for the browser's location
const icon2 = L.icon({
  iconSize: [30, 30],
  // iconAnchor: [0, 0],
  // popupAnchor: [2, -40],
  iconUrl: require('../img/mylocation.png')
});

  const [position, setPosition] = useState(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng,
        map.getZoom()
      );
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}
      icon={icon2}
    >
    </Marker>
  );
}