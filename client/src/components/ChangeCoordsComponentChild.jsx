import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
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

export default function ChangeCoordsComponentChild({ coords }) {
  // STATIC MARKER POSITIONS
  const position = [42.2974279, -85.628292];

  return (
    <MapContainer center={position} zoom={13} style={{ height: "90vh" }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords.length > 0 &&
        coords.map((coord, index) => {
          return (
            <Marker key={index} position={[coord[0], coord[1]]} icon={icon} />
          );
        })}

      <Bounds coords={coords} />
    </MapContainer>
  );
}
