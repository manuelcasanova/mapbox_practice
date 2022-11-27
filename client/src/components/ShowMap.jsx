import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'

import { useMapEvents } from 'react-leaflet/hooks'


//const position = [49.282730, -123.120735]
const center = {
  lat: 49.282730,
  lng: -123.120735,
}

const vancouver = [center.lat, center.lng]

export default function ShowMap() {

  // useEffect(() => {
  //   pwdRef.current.focus();
  // }, [])


  function DraggableMarker() {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    console.log("position", position)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])

    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
  }


  return (


    
    <div className='map'>
 <MapContainer center={vancouver} zoom={12} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {/* <Marker position={position}>

    </Marker> */}
 <DraggableMarker />
  </MapContainer>
  {/* <div>Position: {position}</div> */}
    </div>
   
  )
}