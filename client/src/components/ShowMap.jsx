import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

const position = [49.282730, -123.120735]

export default function ShowMap() {
  return (
    <div className='map'>
 <MapContainer center={position} zoom={12} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
    </div>
   
  )
}