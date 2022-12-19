import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, buttonDelete, setButtonDelete, removeMarker}) {

  // console.log("but delete", buttonDelete)

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
          eventHandlers={{
            click: (e) => {
              // console.log(e.latlng);
              // removeMarker(pos)
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