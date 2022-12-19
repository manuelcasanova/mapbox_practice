import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RideMap from "./RideMap";

const icon_black = L.icon({
  iconSize: [10, 10],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../components/img/black-square.png'),
  // iconUrl: require('../components/img/black-square2.jpeg'),
  // shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

const icon_green = L.icon({
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../components/img/greencircle.png'),
});

const icon_flag = L.icon({
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../components/img/racingflag.png'),
});

//Icon for the browser's location
const icon2 = L.icon({
  iconSize: [30, 30],
  // iconAnchor: [0, 0],
  // popupAnchor: [2, -40],
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
        map.getZoom()
        );
      // const radius = e.accuracy;
      // const circle = L.circle(e.latlng, radius);
      // circle.addTo(map);
      // console.log("latlang", Object.values(e.latlng))
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} 
     icon={icon2}
    >
    </Marker>
  );
}

///Fly end




export default function ChangeCoordsComponentChild({ coords, setCoords, rideCoords }) {
  // STATIC MARKER POSITIONS
  // const position = [49.283255, -123.119930];

// console.log("coords", coords)
//  console.log("rideCoords", Object.values(rideCoords[0]))

  return (
    <div>
      {/* Viewing map */}
    <div className="map-outer-container">

    
    <MapContainer 
    // className="map-outer-container"
    // center={position} 
    zoom={13} >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
          <button
    className="seeride"


 
      onClick={() =>
        //Slice so it does not draw a line between the browser's location and the first point

        setCoords(rideCoords.slice(1))
        
      }
    >See ride</button> 
    

 {/* Show or do not show markers */}

      {coords.length > 0 &&
        coords.map((coord, index) => {
         
          return (
            <>
            
            <Marker 
            
            key={index} 
            position={[coord[0], coord[1]]} 

            icon={
              index === 0 ? icon_green : icon_black
            }

//Introduce icon_flag for last marker

            />
             </>
          );
         
        })}

      {coords.length > 1 && <Bounds coords={coords} />}
 
      <Polyline positions={coords} color="black" />
      <LocationMarker />

    </MapContainer>
    </div>
    
    {/* Editing map */}
    <RideMap />
    </div>
  );
}
