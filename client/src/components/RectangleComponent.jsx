import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

export default function RectangleComponent () {

/////parent

const [points, setPoints] = useState();
const [loading, setLoading] = useState(false);

let latitudesArray = []
let longitudesArray = []


const [bounds, setBounds] = useState([])

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

useEffect(() => {
  console.log("points", points)
}, [points])

{
  loading && points.map((point) => {
    console.log("point", point)
    latitudesArray.push(Number(point.lat))
    longitudesArray.push(Number(point.lng))
    
  })
}


console.log("arrays", latitudesArray, longitudesArray)

////// </parent>

///////rectangle starts

  const innerBounds = [
    [49.505, -2.09],
    [53.505, 2.09],
  ]
  const outerBounds = [
    [50.505, -29.09],
    [52.505, 29.09],
  ]
  
  const redColor = { color: 'red' }
  const whiteColor = { color: 'white' }
  



  function SetBoundsRectangles() {

    const [bounds, setBounds] = useState(outerBounds)
    const map = useMap()
  
    const innerHandlers = useMemo(
      () => ({
        click() {
          setBounds(innerBounds)
          map.fitBounds(innerBounds)
        },
      }),
      [map],
    )
    const outerHandlers = useMemo(
      () => ({
        click() {
          setBounds(outerBounds)
          map.fitBounds(outerBounds)
        },
      }),
      [map],
    )
  
    return (
      <>
        <Rectangle
          bounds={outerBounds}
          eventHandlers={outerHandlers}
          pathOptions={bounds === outerBounds ? redColor : whiteColor}
        />
        <Rectangle
          bounds={innerBounds}
          eventHandlers={innerHandlers}
          pathOptions={bounds === innerBounds ? redColor : whiteColor}
        />
      </>
    )

  }


  
  return (
    <MapContainer bounds={outerBounds} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <SetBoundsRectangles />
  </MapContainer>
  )
}