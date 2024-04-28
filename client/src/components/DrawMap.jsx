import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import LocationMarker from './util_functions/LocationMarker.jsx'
import greencircle from '../components/img/greencircle.png'
import recyclingBin from '../components/img/delete.png'
import undo from '../components/img/undo.png'
import AddMarker from "./AddMarker";
import { useAuth } from "./Context/AuthContext";
import { useCoords } from '../components/util_functions/GetBrowserLocation';

//Util functions

import { removeUsersFromMap } from "./util_functions/map_functions.jsx";
import { deleteMap } from "./util_functions/map_functions.jsx";
import { deactivateMap } from "./util_functions/map_functions.jsx";

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




export default function DrawMap({ maps, setMaps, mapId, setMapId, editAllowed, setFake }) {

  const { user } = useAuth();
  const isSuperAdmin = user.isSuperAdmin;
  const { browCoords } = useCoords();

  const foundMap = maps.find(obj => obj.id === parseInt(mapId));
  if (foundMap) {
    setMapId(foundMap.id);
  }


  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);
  const [coordinadasPara, setCoordinadasPara] = useState([]);
  const [coord, setCoord] = useState([]);
  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(0)
  // const defaultPosition = ; // Downtown Vancouver, BC coordinates

  const [confirmDelete, setConfirmDelete] = useState(false)

  const defaultPosition = useMemo(() => {
    // Initialize your default position here
    return browCoords || [59.2827, -123.1207]
  }, [browCoords]); // Add dependencies if needed

  // Initialize state variable to hold positions for the polyline
  const [coordinatesForPolyline, setCoordinatesForPolyline] = useState([]);

  //Get data from maps to allow editing only those maps createdby the user, not those public maps created by another user, that can be user by the user, but not edited:
  const userId = user.id;

  const isMapCreatedByUser = maps.find(map => map.id === mapId && map.createdby === user.id) !== undefined;

  // console.log("imcby", isMapCreatedByUser)


  //Modifies the frontend message if user can edit the map (created by them) or not. 

  // Sets the points of the map when a map is loaded
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${mapId}`);
        // console.log("API Response:", response.data); // Log API response
        setPoints(response.data);
        setLoading(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [mapId]);

  //Avoid ESLINT error by using these variables

  useEffect(() => {

  }, [points, loading, coordinatesForPolyline]);


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

        if (response.data.length === 0) {
          // If coordinates are empty, set coordinadasPara to defaultPosition.
          setCoordinadasPara([[
            String(defaultPosition[0]),
            String(defaultPosition[1])
          ]]);
        } else {
          const coordinates = response.data.map(coordinadas => [
            String(coordinadas.lat),
            String(coordinadas.lng)
          ]);

          setCoordinadasPara(coordinates);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchData();
  }, [mapId, defaultPosition]);

  //Fetches points from map. Transforms them (Array of objects with value/key pair) to array with two strings (format for bounds), sets coordinatesForPolyline with these arrays.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/points/${mapId}`);

        const coordinates = response.data.map(coordinadas => [
          String(coordinadas.lat),
          String(coordinadas.lng)
        ]);

        setCoordinatesForPolyline(coordinates);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchData();
  }, [mapId,
    removePoint,
    coord,
    markersState.data
  ]);



  //Add new markers to the local state, update the state with the new data, prepare to send the data to the server (body), send the post request (axios). 

  const saveMarkers = (newMarkerCoords) => {

    const data = [...markersState.data, newMarkerCoords];
    // console.log("data", data)
    setMarkersState((prevState) => ({ ...prevState, data }));

    const body = {
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


  const handleConfirmDelete = () => {
    setConfirmDelete(prev => !prev)
  }


  return (

    <div className="map-outer-container">
      <>
        {/* <div>
      <p>Latitude: {browCoords[0]}</p>
      <p>Longitude: {browCoords[1]}</p>
    </div> */}
        {/* {console.log("maps", maps)} */}

        {
          // maps && user.id === maps[0].createdby &&
          editAllowed &&
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
        }

        <MapContainer zoom={12}>

          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />



          <AddMarker
            maps={maps}
            saveMarkers={saveMarkers}
            setRemovePoint={setRemovePoint}
            coord={coord}
            setCoord={setCoord}
            mapId={mapId}
            defaultPosition={defaultPosition}
            editAllowed={editAllowed}
          />





          {/* Sends defaultBounds and coordinadasPara to the Bounds function, that gets the southwestermost and northeasternmost points to set the bounds of the map */}
          {coordinadasPara.length > 1 ? (
            <Bounds coordinadasPara={coordinadasPara} />
          ) : (
            coordinadasPara.length === 1 && (
              <Bounds coordinadasPara={coordinadasPara} />
            )
          )}

          {/* {defaultBounds.length > 1 && <Bounds defaultBounds={defaultBounds} />} */}

          {/* <Polyline positions={coordinatesForPolyline} color="black" /> */}

          <LocationMarker />

        </MapContainer>


        {!isSuperAdmin && (
  maps.length && editAllowed ? (
    confirmDelete ? (
      <button onClick={() => deactivateMap(mapId, userId, isMapCreatedByUser, setMaps, setFake, setConfirmDelete)}>Confirm delete</button>
    ) : (
      <button onClick={handleConfirmDelete}>Delete map</button>
    )
  ) : (
    confirmDelete ? (
      <button onClick={() => removeUsersFromMap(userId, mapId, setFake)}>Confirm remove from my maps</button>
    ) : (
      <button onClick={handleConfirmDelete}>Remove from my maps</button>
    )
  )
)}





      </>
    </div>


  );
}
