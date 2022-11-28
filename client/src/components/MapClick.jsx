import React, { Component, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import RoutineMachine from "./RoutineMachine";

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function MyComponent({ saveMarkers }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      L.marker([lat, lng], { icon }).addTo(map);
      saveMarkers([lat, lng]);
    }
  });
  return null;
}


export default class MapClick extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      markers: [[49.282730, -123.120735]],
      data: []
    };
  }


  saveMarkers = (newMarkerCoords) => {
    const data = [...this.state.data, newMarkerCoords];
    this.setState((prevState) => ({ ...prevState, data }));
  };



  render() {



    return (

      <div>
        {console.log(this.state.data)}
        <MapContainer
          className="Map"
          center={{ lat: 49.282730, lng: -123.120735 }}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyComponent saveMarkers={this.saveMarkers} />
          <RoutineMachine datos={this.state.data} />
        </MapContainer>
      </div>
    );
  }
}