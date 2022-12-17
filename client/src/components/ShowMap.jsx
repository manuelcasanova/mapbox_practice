// import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

// import points_data from '../api/api'

// // console.log("points data", points_data)

// // const market = new L.Icon({

// // })

// const position = [49.282730, -123.120735]
// const center = {
//   lat: 49.282730,
//   lng: -123.120735,
// }

// const vancouver = [center.lat, center.lng]

// export default function ShowMap() {

//   return (


    
//     <div className='map'>
//  <MapContainer center={vancouver} zoom={12} scrollWheelZoom={true}>
//     <TileLayer
//       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//     />
//     <Marker position={position}>

//     </Marker>
//     {points_data.map(point => (
//       <Marker 
//       key={point.id}
//       position={[point.latitude, point.longitude]}
//       />
//     )
      
//       )}

//   </MapContainer>
//     </div>
   
//   )
// }