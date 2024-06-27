import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./util_functions/LocationMarker";

//Icons

import { icon_black, icon_green, icon_flag } from "./img/Icons";

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

export default function PreviewMapChild({ rideCoords, mapId, mapTitle, mapCreatedBy }) {

// console.log (`PreviewMapChild --> mapId ${mapId} mapTitle ${mapTitle} mapCreatedBy ${mapCreatedBy}`)

  if (!rideCoords || rideCoords.length === 0) {
    return <div className="loading"></div>; 
  }

  const coords = rideCoords.slice(1);
// console.log("coords in PMC", coords)
  return (
    <>
      {/* Viewing map */}
      <div
        className="map-outer-container"
      >

        {/* Map id: {mapId}
        Map title: {mapTitle}
        Map created by: {mapCreatedBy} */}

        <MapContainer
          // className="map-outer-container"
          // center={position} 
          zoom={13} >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Show or do not show markers */}

          {coords.length > 0 &&
            coords.map((coord, index) => {


              return (


                <Marker

                  key={index}
                  position={[coord[0], coord[1]]}

                  icon={
                    index === 0 ? icon_green : index === coords.length - 1 ? icon_flag : icon_black
                  }
                />

              );

            })}

          {coords.length > 1 && <Bounds coords={coords} />}



          <Polyline positions={coords} 
          pathOptions={{color: 'black'}}  
          />

          <LocationMarker />

        </MapContainer>
      </div>
    </>
  );
}
