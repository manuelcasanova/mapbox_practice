//ORIGINAL

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import AddMarker from "./AddMarker";

L.Marker.prototype.options.icon = L.icon({
  // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconUrl: require('../components/img/black-square.jpeg'),

  iconSize: [15, 15],
  iconAnchor: [0, 0],
  popupAnchor: true,
  shadowUrl: true,
  shadowSize: true,
  shadowAnchor: true
});

export default function RideMap({longitudesArray, latitudesArray}) {

console.log("arrays in child", longitudesArray, latitudesArray)

  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(false)
  const [coordinadasPara, setCoordinadasPara] = useState([])


  const [coord, setCoord] = useState([]);





  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        //  console.log("res data", res.data)
        // const objValues = Object.values(res.data)
        // console.log("objValues", objValues)

        setCoordinadasPara(
          res.data.map((coordinadas) => {
            // console.log(coordinadas.lat, coordinadas.lng)
            let coord = [Number(coordinadas.lat), Number(coordinadas.lng)]
            // console.log("coord", coord)
            // console.log("res", res.data[1].lat, res.data[1].lng)
            return coord
          })
        )
      })
  }, [removePoint])

  // useEffect(() => {
  //    setSouthWestLatitude(latitudesArray.sort()[0]);
  //    setSouthWestLongitude(longitudesArray.sort()[0]);
  //    setNorthEastLatitude(latitudesArray.sort()[latitudesArray.length - 1]);
  //    setNorthEastLongitude(longitudesArray.sort()[longitudesArray.length - 1]);

  // }, [])

  const position = [49.282730, -123.120735];
  const [state, setState] = useState({
    markers: [position],
    data: []
  })

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

  // const pos = [
  //   coordinadasPara
  // ];

  console.log("lat arr", latitudesArray.sort()[0])
  console.log("lng arr", longitudesArray.sort()[0])


// console.log("state.markers", state.markers[0])

  return (
    <div className="map-outer-container">
      <MapContainer
          // bounds={[[49.25, -123.25], [49.3, -122.9]]}
          bounds={[[latitudesArray.sort()[0], longitudesArray.sort()[0]], [latitudesArray.sort()[0], longitudesArray.sort()[0]]]}
          
          // bounds={[latitudesArray.sort()[0], longitudesArray.sort()[0]]}
        
      // center={state.markers[0]} 
      
    
     
      // center={[southwestLng, southwestLat]}
      zoom={14} 


      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarker saveMarkers={saveMarkers} setRemovePoint={setRemovePoint}
          coord={coord}
          setCoord={setCoord} />
        <Polyline positions={coordinadasPara} color="black" />
      </MapContainer>
    </div>

  );
}
