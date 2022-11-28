import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

import points_data from "../api/api";

console.log("points data", points_data)


const createRoutineMachineLayer = (props) => {
  
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(points_data[0].latitude, points_data[0].longitude),
      L.latLng(points_data[1].latitude, points_data[1].longitude)
      ,
      L.latLng(points_data[2].latitude, points_data[2].longitude),
      L.latLng(points_data[3].latitude, points_data[3].longitude)
    ],
    lineOptions: {
      styles: [{ color: "#FC6600", weight: 6 }]
    },
    show: false,
    addWaypoints: true,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
