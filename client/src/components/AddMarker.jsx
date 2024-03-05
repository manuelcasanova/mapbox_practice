import { useEffect } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function AddMarker({ saveMarkers, setRemovePoint, coord, setCoord, setRefresh, mapId}) {

  const icon_black = L.icon({
    iconSize: [2, 2],
    iconAnchor: [0, 0],
    popupAnchor: [2, -40],
    iconUrl: require('../components/img/black-square.png'),
  });

  const icon_green = L.icon({
    iconSize: [30, 30],
    iconUrl: require('../components/img/greencircle.png'),
  });

  const icon_flag = L.icon({
    iconSize: [20, 20],
    iconUrl: require('../components/img/raceflag.png'),
  });


  useEffect(() => {
    axios.get(`http://localhost:3500/points/${mapId}`)
      .then(function (res) {
        setCoord([...res.data])
      })
      .catch(function (error) {
        console.error('Error fetching points data:', error);
      });
  }, [mapId])

  useMapEvents({
    click: (e) => {
      setCoord([...coord, e.latlng]);
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
      setRemovePoint(prevState => prevState + 1)
      // setRefresh(prev => prev + 1)
    }
  });



  return (
    <div>
      {coord.map((pos, index) => (
       
        
        <Marker
          key={`marker-${index}`}
          position={pos}
          // draggable={true}

          icon={
            index === 0 ? icon_green : index === coord.length - 1 ? icon_flag : icon_black 
          }

          eventHandlers={{
            click: (e) => {
              // console.log(e.latlng);
              // removeMarker(pos)
              // console.log("pos", pos)
            }
          }}
        />
      ))}
    </div>
  );
}