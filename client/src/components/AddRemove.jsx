import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import AddMarker from "./AddMarker";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

export default function AddRemove() {
  const position = [49.282730, -123.120735];
    const [state, setState] = useState({
    markers: [[49.282730, -123.120735]],
    data: []
  })

  const saveMarkers = (newMarkerCoords) => {
    const data = [...state.data, newMarkerCoords];
    setState((prevState) => ({ ...prevState, data }));
    console.log("data", data);
    console.log("new marker", newMarkerCoords)

    let coords = Object.values(newMarkerCoords);

    const body = {
      coords
    }

    axios.post(`http://localhost:3500/points`, body)
      .then((response) => {
        console.log(response.data)
      })
  };

  return (
    <MapContainer center={state.markers[0]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddMarker saveMarkers={saveMarkers}/>
    </MapContainer>
  );
}
