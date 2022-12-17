
// //DRAW LINES AND OTHERS ON THE MAP


// import React, { useState } from 'react';
// import { Map, TileLayer, FeatureGroup, MapContainer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';
// import { EditControl } from 'react-leaflet-draw';
// import 'leaflet-draw';

// const Polyline = () => {
//     const [editableFG, setEditableFG] = useState(null);

//     const onCreated = e => {
//         console.log(e.layer.editing.latlngs);
//         // console.log(editableFG);

//         console.log("coords polyline", e.layer.editing.latlangs)

//         const drawnItems = editableFG.leafletElement._layers;
//         console.log(drawnItems);
//         if (Object.keys(drawnItems).length > 1) {
//             Object.keys(drawnItems).forEach((layerid, index) => {
//                 if (index > 0) return;
//                 const layer = drawnItems[layerid];
//                 editableFG.leafletElement.removeLayer(layer);
//             });
//             console.log(drawnItems);
//         }
//     };

//     const onFeatureGroupReady = reactFGref => {
//         // store the ref for future access to content
//         setEditableFG(reactFGref);
//     };

//     return (
//         <MapContainer
//             center={[49.282730, -123.120735]}
//             zoom={13}
//             style={{ height: '100vh' }}>
//             <TileLayer
//                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMapContainer</a> contributors'
//                 url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
//             />
//             <FeatureGroup
//                 ref={featureGroupRef => {
//                     onFeatureGroupReady(featureGroupRef);
//                 }}>
//                 <EditControl position="topright" onCreated={onCreated} />
//             </FeatureGroup>
//         </MapContainer>
//     );
// };

// export default Polyline;