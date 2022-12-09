import { useEffect, useState } from "react"
import axios from 'axios'
import RideMap from "./RideMap";

export default function RideMapParent() {

  const [objValues, setObjValues] = useState({})

  let latitudesArray = []
  let longitudesArray = []

  const [southWestLatitude, setSouthWestLatitude] = useState([]);
  const [southWestLongitude, setSouthWestLongitude] = useState([]);
  const [northEastLatitude, setNorthEastLatitude] = useState([]);
  const [northEastLongitude, setNorthEastLongitude] = useState([]);

  const [bounds, setBounds] = useState([])

  useEffect(() => {

    async function getPoints() {
      try {
        const response = await axios.get(`http://localhost:3500/points`);
        setObjValues(Object.values(response.data))
      } catch (error) {
        console.error(error)
      }
    }

    console.log("obj val", objValues)

    // axios.get(`http://localhost:3500/points`)
    //   .then((res) => {
    //     setObjValues(Object.values(res.data))
    //   })

    async function pushToArray() {
      try {
        objValues.map((limits) => {
          console.log("limits", limits)
          // latitudesArray.push(Number(limits.lat))
          // longitudesArray.push(Number(limits.lng))
          
        })
      } catch (error) {
        console.error(error)
      }
    }

    

    //   .then(() => {
    //     objValues.map((limits) => {
    //       latitudesArray.push(Number(limits.lat))
    //       longitudesArray.push(Number(limits.lng))
    //     })
    //   })

    //   .then(() => {
    //     setSouthWestLatitude(latitudesArray.sort()[0]);
    //     setSouthWestLongitude(longitudesArray.sort()[0]);
    //     setNorthEastLatitude(latitudesArray.sort()[latitudesArray.length - 1]);
    //     setNorthEastLongitude(longitudesArray.sort()[longitudesArray.length - 1]);


    //     console.log("here", southWestLatitude, southWestLongitude, northEastLatitude, northEastLongitude)

    //     // setBounds([[1,2], [3,4]])

    //     console.log("bounds in parent", bounds)
    //   })


  }, [])








  return (
    // <RideMap bounds={bounds}/>
    <>Ridemap</>
  )
}