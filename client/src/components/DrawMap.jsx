//ORIGINAL

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
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

//Icon for the browser's location
const icon2 = L.icon({
  iconSize: [30, 30],
  // iconAnchor: [0, 0],
  // popupAnchor: [2, -40],
  iconUrl: require('../components/img/mylocation.png'),
});

export default function DrawMap({ refresh, setRefresh }) {

  const [points, setPoints] = useState();
  const [loading, setLoading] = useState(false);

  const getPoints = async () => {
    try {
      const response = await axios.get('http://localhost:3500/points');
      setPoints(response.data)
      setLoading(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    getPoints();

  }, [])

  //State used to refresh when a point is added or removed, so the connecting line adjusts to the new route.
  const [removePoint, setRemovePoint] = useState(0)
  const [coordinadasPara, setCoordinadasPara] = useState([])


  const [coord, setCoord] = useState([]);


  const [buttonDelete, setButtonDelete] = useState(0)

  const position = [49.282730, -123.120735];
  const [markersState, setMarkersState] = useState({
    markers: [position],
    data: []
  })

  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        setCoordinadasPara(
          res.data.map((coordinadas) => {
            let coord = [Number(coordinadas.lat), Number(coordinadas.lng)]
            return coord
          })
        )
      })
  }, [removePoint, coord, markersState.data
    //(works but causes infinite loop)
    //,coordinadasPara 
  ])



  const saveMarkers = (newMarkerCoords) => {
    const data = [...markersState.data, newMarkerCoords];
    setMarkersState((prevState) => ({ ...prevState, data }));

    let coords = Object.values(newMarkerCoords);

    const body = {
      coords
    }

    axios.post(`http://localhost:3500/points`, body)
      .then((response) => {
        // console.log(response.data)
      })

  };

  let boundsHardcoded = [[49.25, -123.25], [49.3, -122.9]]

  // Remove one marker
  const removeMarker = (pos) => {
    setCoord((coord.slice(0, -1))
    );

    axios.post(`http://localhost:3500/points/delete/`, coord.slice(-1)[0])
      .then((response) => {
        // console.log(response.data)
      })
    setRemovePoint(prev => prev + 1)
  };

  //Remove all markers

  const removeAll = () => {
    setCoord(([]));

    axios.post(`http://localhost:3500/points/delete/all`)
      .then((response) => {
        // console.log(response.data)
      })
    setRemovePoint(prev => prev + 1)
  };


  //Remove last marker added
  const deleteLast = (e) => {

    e.preventDefault();
    // console.log("Clicked");
    removeMarker(coord.slice(0, -1))
    setRefresh(prev => prev + 1)
  }

  // Remove all markers
  const deleteAll = (e) => {

    e.preventDefault();
    // console.log("Clicked");
    removeAll(coord)
    setRefresh(prev => prev + 1)
  }



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

        <MapContainer
          bounds={boundsHardcoded}
          zoom={12}
        >

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
          />

          <Polyline positions={coordinadasPara} color="black" />

          <LocationMarker />

        </MapContainer>
      </>
    </div>


  );
}
