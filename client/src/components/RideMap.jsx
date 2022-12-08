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

export default function RideMap({objValues, setSetBounds}) {


// console.log("Obj values in child", objValues)

  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(false)
  const [coordinadasPara, setCoordinadasPara] = useState([])
  // console.log("coordinadasPara", coordinadasPara)

  const [coord, setCoord] = useState([]);


  const [southwestLat, setSouthwestLat] = useState(-90);
  const [southwestLng, setSouthwestLng] = useState(-180);
  const [northeastLat, setNortheastLat] = useState(90);
  const [northeastLng, setNortheastLng] = useState(180);


  

  let soutwestBound = [southwestLat, southwestLng]
  let northeastBound = [northeastLat, northeastLng]

  // console.log("swbound", soutwestBound)
  // console.log("nebound", northeastBound)

  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        //  console.log("res data", res.data)
        const objValues = Object.values(res.data)
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

  useEffect(() => {
  coord.map((bnd) => {
    console.log("bnd lng", typeof Number(bnd.lng))
    console.log("bnd lat", typeof Number(bnd.lat))
    console.log("bnd", bnd)
    console.log("type of bnd", typeof bnd)
    //if....then
    if (bnd.lng > southwestLng) {
      setSouthwestLng(Number(bnd.lng))
    }
    if (bnd.lat > southwestLat) {
      setSouthwestLat(Number(bnd.lat))
    }
    if (bnd.lng < northeastLng) {
      setNortheastLng(Number(bnd.lng))
    }
    if (bnd.lat < northeastLat) {
      setNortheastLat(Number(bnd.lat))
    }
  })
  setSetBounds(prev => prev + 1)
  
}, [coordinadasPara])

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

  const pos = [
    coordinadasPara
  ];

  // console.log("coord", coord[0].lat)
  // console.log("coord", coord[0].lng)

  // loop through coord check bigger number smaller number pass to array set as variable bounds.

  //Soutwest lowest lat & lng
  //Northwest highes lat & lng

  // const [bounds, setBounds] = useState([[49.29642612371167, -123.13666776796951]])
  // console.log("bounds", bounds)

   const [test, setTest] = useState([[49.29642612371167, -123.13666776796951], [49.4, -123]])



   console.log("test", test)

  const bounds = [soutwestBound, northeastBound]

console.log("swbound", soutwestBound)
console.log("nebound", northeastBound)

  console.log("bounds on child", bounds)

  console.log("STATE MARKERS 0", state.markers[0])
  console.log("lng lat", [southwestLat, southwestLng])



  return (
    <div className="map-outer-container">
      <MapContainer
        // bounds={[soutwestBound, [49.2, -123]]}
        bounds={bounds}
      // center={state.markers[0]} 
     
      // center={[southwestLng, southwestLat]}
      // zoom={14} 



      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarker saveMarkers={saveMarkers} setRemovePoint={setRemovePoint}
          coord={coord}
          setCoord={setCoord} />
        <Polyline positions={pos} color="black" />
      </MapContainer>
    </div>

  );
}
