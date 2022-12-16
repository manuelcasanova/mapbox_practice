import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RideMap from "./RideMap";

const icon = L.icon({
  iconSize: [15, 15],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../components/img/black-square.png'),
  // shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

//Icon for the browser's location
const icon2 = L.icon({
  iconSize: [60, 60],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../components/img/mylocation.png'),
});

const group = L.featureGroup();

function Bounds({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    group.clearLayers();

    coords.forEach((marker) => group.addLayer(L.marker(marker)));

    map.fitBounds(group.getBounds());
  }, [map, coords]);

  return null;
}

///Fly

function LocationMarker() {
  const [position, setPosition] = useState(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 
        // map.getZoom()
        );
      // const radius = e.accuracy;
      // const circle = L.circle(e.latlng, radius);
      // circle.addTo(map);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} 
     icon={icon2}
    >
    </Marker>
  );
}

///FLy end

export default function ChangeCoordsComponentChild({ coords, setCoords, rideCoords, setMount }) {
  // STATIC MARKER POSITIONS
  // const position = [49.283255, -123.119930];

  return (
    <>
    
    {/* <MapContainer 
    
    // center={position} 
    zoom={13} style={{ height: "90vh" }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
          <button
    className="centeride"
      onClick={() =>
        setCoords(rideCoords)
      }
    >See ride</button> 


{/* Show or do not show markers */}

      {/* {coords.length > 0 &&
        coords.map((coord, index) => {
          return (
            <Marker key={index} position={[coord[0], coord[1]]} icon={icon} 
            />
          );
        })} */}

      {/* <Bounds coords={coords} />
      <Polyline positions={coords} color="black" />
      <LocationMarker />
      setMount(true)
    </MapContainer> */}
    
    <RideMap />
    </>
  );
}
