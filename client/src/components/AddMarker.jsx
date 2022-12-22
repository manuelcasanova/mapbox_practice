import { useEffect, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, buttonDelete, setButtonDelete, removeMarker, refresh, setRefresh}) {

  // console.log("but delete", buttonDelete)

  const icon_black = L.icon({
    iconSize: [2, 2],
    iconAnchor: [0, 0],
    popupAnchor: [2, -40],
    iconUrl: require('../components/img/black-square.png'),
    // iconUrl: require('../components/img/black-square2.jpeg'),
    // shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
  });

  const icon_green = L.icon({
    iconSize: [30, 30],
    // iconAnchor: [0, 0],
    // popupAnchor: [2, -40],
    iconUrl: require('../components/img/greencircle.png'),
  });

  const icon_flag = L.icon({
    iconSize: [20, 20],
    // iconAnchor: [0, 0],
    // popupAnchor: [2, -40],
    iconUrl: require('../components/img/raceflag.png'),
  });


  useEffect(() => {
    axios.get(`http://localhost:3500/points`)
      .then(function (res) {
        setCoord([...res.data])
        // console.log("res data", res.data)
        // console.log("coord", coord)
      })
  }, [])

  useMapEvents({
    click: (e) => {
      setCoord([...coord, e.latlng]);
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
      // console.log("e", e)
      // console.log("type of e.latlng", typeof e.latlng)
      // console.log("e.latlng", e.latlng)
      // console.log("values", Object.values(e.latlng))
      setRemovePoint(prevState => prevState + 1)
      setRefresh(prev => prev + 1)
    }
  });

  useEffect(() => {
    //  console.log("coord", coord);
  }, [coord]);

  // const removeMarker = (pos) => {
  //    console.log("type of deleted pos", typeof pos)
  //    console.log("deleted pos", pos)
  //    console.log("last item array", coord.slice(-1)[0])
  
    
  //   //  setCoord((prevCoord) =>
  //   //   prevCoord.filter((coord) => JSON.stringify(coord) !== JSON.stringify(pos))
  //   // );

  //   setCoord((coord.slice(0, -1))
  // );

  //   // axios.post(`http://localhost:3500/points/delete/`, pos)
  //   axios.post(`http://localhost:3500/points/delete/`, coord.slice(-1)[0])
  //   // axios.post(`http://localhost:3500/points/delete/`, coord.lenght - 1)
  //     .then((response) => {
  //       // console.log(response.data)
  //     })
  //   setRemovePoint(prev => prev + 1)
  // };

//  console.log("coord", coord)
//  console.log("array", Object.values(coord[0]))
  // // console.log("coord minus last", coord.slice(0, -1))

  

  return (
    <div>
      {coord.map((pos, idx) => (
       
        
        <Marker
          key={`marker-${idx}`}
          position={pos}
          // draggable={true}


          icon={
            idx === 0 ? icon_green : idx === coord.length - 1 ? icon_flag : icon_black 
          }


          eventHandlers={{
            click: (e) => {
              // console.log(e.latlng);
              // removeMarker(pos)
              // console.log("pos", pos)
            }
          }}
         
        >
          
          {/* <Popup>
            <button onClick={() => removeMarker(pos)}>Remove marker</button>
          </Popup> */}
        </Marker>
        
        
      ))}
    </div>
  );
}