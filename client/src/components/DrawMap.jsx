import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import LocationMarker from './util_functions/LocationMarker.jsx'
import greencircle from '../components/img/greencircle.png'
import recyclingBin from '../components/img/delete.png'
import undo from '../components/img/undo.png'
import AddMarker from "./AddMarker";
import BrowserCoords from "./util_functions/GetBrowserLocation.jsx";

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

const group = L.featureGroup();

function Bounds({ coordinadasPara }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    group.clearLayers();

    coordinadasPara.forEach((marker) => group.addLayer(L.marker(marker)));

    map.fitBounds(group.getBounds());
    
  }, [map, coordinadasPara]);

  return null;
}


export default function DrawMap({ setRefresh, mapId }) {


  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);
  const [coordinadasPara, setCoordinadasPara] = useState([]);
  const [markersData, setMarkersData] = useState([]);
  const [coord, setCoord] = useState([]);
  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(0)
  const position = [49.282730, -123.120735];
  // const defaultPosition = [[49.25, -123.25], [49.3, -122.9]];
  const defaultPosition = [BrowserCoords];
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
        
        
        
const coordinates = response.data.map(coordinadas => [
  String(coordinadas.lat),
  String(coordinadas.lng)
]);
        setCoordinadasPara(coordinates);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchData();
  }, [mapId, removePoint, coord, markersState.data]);


  useEffect(() => {
    if (coordinadasPara.length === 0) {
      setBounds(defaultPosition);
    } else {
      const southwest = [coordinadasPara[0][0], coordinadasPara[0][1]];
      const northeast = [coordinadasPara[coordinadasPara.length - 1][0], coordinadasPara[coordinadasPara.length - 1][1]];
      setBounds([southwest, northeast]);

    }
  }, [coordinadasPara]);


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

        <MapContainer zoom={12}>



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

{coordinadasPara.length > 1 && <Bounds coordinadasPara={coordinadasPara} />}

          <Polyline positions={coordinadasPara} color="black" />

          <LocationMarker />

        </MapContainer>
      </>
    </div>


  );
}
