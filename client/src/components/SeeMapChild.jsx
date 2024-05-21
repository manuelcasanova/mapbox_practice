import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./util_functions/LocationMarker";

import { icon_black, icon_green, icon_flag } from "./img/Icons";

const group = L.featureGroup();

function Bounds({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (!map || coords.length === 0) return;

    group.clearLayers();
    coords.forEach((marker) => group.addLayer(L.marker(marker)));

    map.fitBounds(group.getBounds());
  }, [map, coords]);

  return null;
}

export default function SeeMapChild({ rideCoords, mapId, mapTitle, mapCreatedBy }) {
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    if (rideCoords.length > 0) {
      setCoords(rideCoords.slice(1)); // Exclude the first coordinate to avoid drawing a line between browser's location and the first point
    }
  }, [rideCoords]);

  return (
    <>
      {/* Viewing map */}
      <div className="map-outer-container">
        {/* Map id: {mapId}
        Map title: {mapTitle}
        Map created by: {mapCreatedBy} */}

        <MapContainer zoom={13} style={{ height: "400px" }}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Show or do not show markers */}
          {coords.map((coord, index) => (
            <Marker
              key={index}
              position={[coord[0], coord[1]]}
              icon={
                index === 0 ? icon_green : index === coords.length - 1 ? icon_flag : icon_black
              }
            />
          ))}

          {coords.length > 1 && <Bounds coords={coords} />}
          <Polyline positions={coords} pathOptions={{color: 'red'}} />
              {/* LocationMarker disabled to avoid flying to my coords */}
          <LocationMarker /> 
        </MapContainer>
      </div>
    </>
  );
}
