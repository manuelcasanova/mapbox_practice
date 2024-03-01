import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import LocationMarker from './util_functions/LocationMarker.jsx'
import greencircle from '../components/img/greencircle.png'
import recyclingBin from '../components/img/delete.png'
import undo from '../components/img/undo.png'
import AddMarker from "./AddMarker";

L.Marker.prototype.options.icon = L.icon({
  // iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  // iconUrl: require('../components/img/black-square.png'),
  iconUrl: greencircle,
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  // popupAnchor: true,
  // shadowUrl: true,
  // shadowSize: true,
  // shadowAnchor: true
});



export default function DrawMap({ setRefresh, mapId }) {



  // console.log("mapid", mapId)
  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);
  const [coordinadasPara, setCoordinadasPara] = useState([]);
  // console.log("coordinadasPara", coordinadasPara)
  const [markersData, setMarkersData] = useState([]);
  const [coord, setCoord] = useState([]);
  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(0)
  const position = [49.282730, -123.120735];
  const defaultPosition = [[49.25, -123.25], [49.3, -122.9]];
  // const defaultPosition = [[0, 0], [0, 0]];
  const [bounds, setBounds] = useState(defaultPosition);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${mapId}`);
        setPoints(response.data);
        setLoading(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [mapId]);



  const [markersState, setMarkersState] = useState({
    markers: [position],
    data: []
  })


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${mapId}`);
        
        
        
//HERE???????
// const coordinates = response.data.map(coordinadas => [Number(coordinadas.lat), Number(coordinadas.lng)]);
const coordinates = response.data.map(coordinadas => ({
  lat: Number(coordinadas.lat),
  lng: Number(coordinadas.lng)
}));

// console.log("coordinates", coordinates)

        //  {console.log("coordinates2", 

        //  [coordinates[0][0], coordinates[coordinates.length-1][0]]         

        //  )}

        // setBounds([coordinates[0][0], coordinates[coordinates.length - 1][0]])


        // console.log("coordinates", coordinates)
        // console.log("coord", [coord[0].lat, coord[coord.length - 1].lng])
        //  {console.log("coordinates", [coord[0].lat, coord[coord.length-1].lng])}

        setCoordinadasPara(coordinates);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchData();
  }, [mapId, removePoint, coord, markersState.data]);


  useEffect(() => {
    if (coord.length === 0) {
      setBounds(defaultPosition);
    } else {
      const southwest = [coord[0].lat, coord[0].lng];
      const northeast = [coord[coord.length - 1].lat, coord[coord.length - 1].lng];
      setBounds([southwest, northeast]);
    }
  }, [coord]);
  


  const saveMarkers = (newMarkerCoords) => {
    const data = [...markersState.data, newMarkerCoords];
    setMarkersState((prevState) => ({ ...prevState, data }));

    let coords = Object.values(newMarkerCoords);

    const body = {
      //HRE????
      // coords, 
      coords: Object.values(newMarkerCoords),
      mapId
    }

    axios.post(`http://localhost:3500/points`, body)
      .then((response) => {
        // console.log(response.data)
      })

  };

  // Remove one marker
  const removeMarker = async () => {
    const updatedCoord = coord.slice(0, -1);
    await axios.post(`http://localhost:3500/points/delete/`, coord.slice(-1)[0]);
    setCoord(updatedCoord);
  };

  // Remove all markers
  const removeAll = async () => {
    await axios.post(`http://localhost:3500/points/delete/all/${mapId}`);
    setCoord([]);
  };

  // Remove last marker added
  const deleteLast = async (e) => {
    e.preventDefault();
    await removeMarker();
  };

  // Remove all markers
  const deleteAll = async (e) => {
    e.preventDefault();
    await removeAll();
  };

  // Extracting first and last points for setting bounds
  // useEffect(() => {
  //   const firstPoint = coordinadasPara.length > 0 ? coordinadasPara[0] : defaultPosition[0];
  //   const lastPoint = coordinadasPara.length > 0 ? coordinadasPara[coordinadasPara.length - 1] : defaultPosition[1];
  //   setBounds([firstPoint, lastPoint]);
  // }, [coordinadasPara]);
  // {console.log("bounds", bounds)}

  return (

    <div className="map-outer-container">
      <>
        <div className="deletebuttons">

          <img
            className="recbin"
            src={undo}
            alt={"Undo"}
            onClick={deleteLast}
          />

          <img
            className="recbin"
            src={recyclingBin}
            alt={"Recycling bin"}
            onClick={deleteAll}
          />

        </div>

        <MapContainer bounds={bounds} zoom={12}>

          {console.log("bounds in map container", bounds)}
          {/* {console.log("coordinates", [coord[[0][0]], coord[coord.length - 1]])} */}



          {/* {console.log("bounds", [coord[[0].lat], coord[coord.length-1].lng])} */}


          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AddMarker
            saveMarkers={saveMarkers}
            setRemovePoint={setRemovePoint}
            coord={coord}
            setCoord={setCoord}
            setRefresh={setRefresh}
            mapId={mapId}
          />

          <Polyline positions={coordinadasPara} color="black" />

          <LocationMarker />

        </MapContainer>
      </>
    </div>


  );
}
