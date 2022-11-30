import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import AddMarker from "./AddMarker";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

export default function AddRemove() {


  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(false)
  const [coordinadasPara, setCoordinadasPara] = useState([])
  console.log("coordinadasPara", coordinadasPara)

  const position = [49.282730, -123.120735];
    const [state, setState] = useState({
    markers: [[49.282730, -123.120735]],
    data: []
  })

  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        // console.log("res data", res.data)
        const objValues = Object.values(res.data)
        // console.log("objValues", objValues)

        setCoordinadasPara(
          res.data.map((coordinadas) => {
            // console.log(coordinadas.lat, coordinadas.lng)
            let coord = [Number(coordinadas.lat), Number(coordinadas.lng)]
            console.log("coord", coord)
            // console.log("res", res.data[1].lat, res.data[1].lng)
            return coord
          })
        )


      })
  }, [removePoint]) 

  const saveMarkers = (newMarkerCoords) => {
    const data = [...state.data, newMarkerCoords];
    setState((prevState) => ({ ...prevState, data }));
    // console.log("data", data);
    // console.log("new marker", newMarkerCoords)

    let coords = Object.values(newMarkerCoords);
    // console.log("state", state.data)

    const body = {
      coords
    }

    axios.post(`http://localhost:3500/points`, body)
      .then((response) => {
        // console.log(response.data)
      })
  };


  const pos = [
    coordinadasPara
  ];

  return (
    <MapContainer center={state.markers[0]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddMarker saveMarkers={saveMarkers} setRemovePoint={setRemovePoint}/>
      <Polyline positions={pos} color="red" />
    </MapContainer>
  );
}
