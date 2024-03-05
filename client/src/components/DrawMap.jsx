import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import LocationMarker from './util_functions/LocationMarker.jsx'
import greencircle from '../components/img/greencircle.png'
import recyclingBin from '../components/img/delete.png'
import undo from '../components/img/undo.png'
import AddMarker from "./AddMarker";


import { useCoords } from '../components/util_functions/GetBrowserLocation';




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

// function Bounds({ coordinadasPara }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     group.clearLayers();

//     coordinadasPara.forEach((marker) => group.addLayer(L.marker(marker)));

//     map.fitBounds(group.getBounds());

//   }, [map, coordinadasPara]);

//   return null;
// }


function Bounds({ coordinadasPara, defaultBounds }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    group.clearLayers();

    if (coordinadasPara && coordinadasPara.length > 0) {
      coordinadasPara.forEach((marker) => group.addLayer(L.marker(marker)));
      map.fitBounds(group.getBounds());
    } else {
      defaultBounds.forEach((marker) => group.addLayer(L.marker(marker)));
      map.fitBounds(group.getBounds());
    }

  }, [map, coordinadasPara, defaultBounds]);

  return null;
}


export default function DrawMap({ setRefresh, mapId }) {

  const { browCoords } = useCoords();

  // console.log("brow coords", browCoords)

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);
  const [coordinadasPara, setCoordinadasPara] = useState([]);
  const [markersData, setMarkersData] = useState([]);
  const [coord, setCoord] = useState([]);
  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(0)
  const defaultPosition = browCoords || [49.2827, -123.1207]; // Downtown Vancouver, BC coordinates

  const defaultBounds = [[String(defaultPosition[0]), String(defaultPosition[1])], [String(defaultPosition[0]), String(defaultPosition[1])]];




  // Sets the points of the map when a map is loaded
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




  //Object with two key/value pairs (array). Markers holds the default position, data will include eventually the new markers added
  const [markersState, setMarkersState] = useState({
    markers: [defaultPosition],
    data: []
  })


  //Fetches points from map. Transforms them (Array of objects with value/key pair) to array with two strings (format for bounds), sets CoordinadasPara with these arrays.
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
  }, [mapId,
    //If the three below are commented out, I achive ot setting bounds after each marker added, but the polyline does not appear as I add markers and does not disappear as I remove them. I'll work now to supply different coordinates variable to the polyline. That should fix it.

    // removePoint,
    // coord,
    // markersState.data
  ]);


  // useEffect(() => {
  //   if (coordinadasPara.length === 0) {
  //     setBounds(defaultPosition);
  //   } else {
  //     const southwest = [coordinadasPara[0][0], coordinadasPara[0][1]];
  //     const northeast = [coordinadasPara[coordinadasPara.length - 1][0], coordinadasPara[coordinadasPara.length - 1][1]];
  //     setBounds([southwest, northeast]);

  //   }
  // }, [coordinadasPara]);


  //Add new markers to the local state, update the state with the new data, prepare to send the data to the server (body), send the post request (axios). 

  const saveMarkers = (newMarkerCoords) => {

    const data = [...markersState.data, newMarkerCoords];
    // console.log("data", data)
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
        {/* <div>
      <p>Latitude: {browCoords[0]}</p>
      <p>Longitude: {browCoords[1]}</p>
    </div> */}

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


{/* Sends defaultBounds and coordinadasPara to the Bounds function, that gets the southwestermost and northeasternmost points to set the bounds of the map */}
{coordinadasPara.length > 1
            ? <Bounds coordinadasPara={coordinadasPara} />
            : <Bounds defaultBounds={defaultBounds} />}

{/* {defaultBounds.length > 1 && <Bounds defaultBounds={defaultBounds} />} */}

          <Polyline positions={coordinadasPara} color="black" />

          <LocationMarker />

        </MapContainer>
      </>
    </div>


  );
}
