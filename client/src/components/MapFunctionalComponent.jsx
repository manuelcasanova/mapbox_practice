// import React, { Component, useEffect, useState } from "react";
// import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from 'axios';

// const icon = L.icon({
//   iconSize: [25, 41],
//   iconAnchor: [10, 41],
//   popupAnchor: [2, -40],
//   iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
// });

// function MyComponent({ saveMarkers }) {
//   const map = useMapEvents({
//     click: (e) => {
//       const { lat, lng } = e.latlng;
//       L.marker([lat, lng], { icon }).addTo(map);
//       saveMarkers([lat, lng]);
//     }
//   });
//   return null;
// }

// export default function MapFunctionalComponent() {

//   const [state, setState] = useState({
//     markers: [[49.282730, -123.120735]],
//     data: []
//   })

//   const saveMarkers = (newMarkerCoords) => {
//     const data = [...state.data, newMarkerCoords];
//     setState((prevState) => ({ ...prevState, data }));
//     // console.log("data", data);
//     // console.log("new marker", newMarkerCoords)

//     let coords = Object.values(newMarkerCoords);

//     const body = {
//       coords
//     }

//     axios.post(`http://localhost:3500/points`, body)
//       .then((response) => {
//         console.log(response.data)
//       })
//   };



//   return (
//     <div className="map">
//       <MapContainer
//         className="Map"
//         center={{ lat: 49.282730, lng: -123.120735 }}
//         zoom={12}
//         scrollWheelZoom={false}
//         style={{ height: "100vh" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <MyComponent saveMarkers={saveMarkers} />
//         {/* <RoutineMachine datos={this.state.data} /> */}
//       </MapContainer>
//     </div>
//   )
// }