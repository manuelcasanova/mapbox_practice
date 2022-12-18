// import { useState, useEffect, useMemo } from "react";
// import { MapContainer, TileLayer, Polyline, useMap, Rectangle } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import axios from "axios";

// import AddMarker from "./AddMarker";

// // L.Marker.prototype.options.icon = L.icon({
// //   // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// //   iconUrl: require('../components/img/black-square.png'),

// //   iconSize: [2, 2],
// //   iconAnchor: [0, 0],
// //   popupAnchor: true,
// //   shadowUrl: true,
// //   shadowSize: true,
// //   shadowAnchor: true
// // });

// export default function BoundsRideMap() {


//   //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
//   const [removePoint, setRemovePoint] = useState(false)
//   const [coordinadasPara, setCoordinadasPara] = useState([])
//   // console.log("coordinadasPara", coordinadasPara)


//   const position = [49.282730, -123.120735];
//   const [state, setState] = useState({
//     markers: [[49.282730, -123.120735]],
//     data: []
//   })

//   const [bounds, setBounds] = useState([
//     [49.29642612371167, -123.13666776796951],
//     [49.371821482995884, -123.09959410196836]
//   ])

//   useEffect(() => {
//     axios.get(`http://localhost:3500/points`)
//       .then(function (res) {
//         // console.log("res data", res.data)
//         const objValues = Object.values(res.data)
//         // console.log("objValues", objValues)

//         setCoordinadasPara(
//           res.data.map((coordinadas) => {
//             // console.log(coordinadas.lat, coordinadas.lng)
//             let coord = [Number(coordinadas.lat), Number(coordinadas.lng)]
//             // console.log("coord", coord)
//             // console.log("res", res.data[1].lat, res.data[1].lng)
//             return coord
//           })
//         )

//         // setBounds(pos[0][0], pos[0][3])

//       })
//   }, [removePoint])

//   const saveMarkers = (newMarkerCoords) => {
//     const data = [...state.data, newMarkerCoords];
//     setState((prevState) => ({ ...prevState, data }));
//     // console.log("data", data);
//     // console.log("new marker", newMarkerCoords)

//     let coords = Object.values(newMarkerCoords);
//     // console.log("state", state.data)

//     const body = {
//       coords
//     }

//     axios.post(`http://localhost:3500/points`, body)
//       .then((response) => {
//         // console.log(response.data)
//       })
//   };


//   const pos = [
//     coordinadasPara
//   ];

//   console.log("pos", pos)

//   console.log("pos 0 0", pos[0][0])
//   console.log("pos 0 3", pos[0][3])







//   const [show, setShow] = useState(false)
 
//   return (
//     <div className="map-outer-container">

// <button
// onClick={() => setShow(true)}
// >Click</button>

//       {show && <MapContainer
//         bounds={bounds}
//         // center={state.markers[0]} 
//         zoom={13}
//       >

//         <TileLayer

//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <AddMarker saveMarkers={saveMarkers} setRemovePoint={setRemovePoint} />
//         <Polyline positions={pos} color="black" />
//         {/* <SetBoundsRectangles /> */}
//       </MapContainer>}
//     </div>

//   );
// }
