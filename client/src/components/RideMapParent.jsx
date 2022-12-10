import { useEffect, useState } from "react"
import axios from 'axios'
import RideMap from "./RideMap";





export default function RideMapParent() {

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

  return (
    <RideMap />
    // <RideMap latitudesArray={latitudesArray} longitudesArray={longitudesArray}/>
    // <div>Ridemap</div>
  )
}

//   const [objValues, setObjValues] = useState()

//   let latitudesArray = []
//   let longitudesArray = []

//   const [southWestLatitude, setSouthWestLatitude] = useState([]);
//   const [southWestLongitude, setSouthWestLongitude] = useState([]);
//   const [northEastLatitude, setNorthEastLatitude] = useState([]);
//   const [northEastLongitude, setNorthEastLongitude] = useState([]);

//   const [bounds, setBounds] = useState([])

//   useEffect(() => {

//   axios.get(`http://localhost:3500/points`)
//     .then((res) => {
//       setObjValues(Object.values(res.data))
//     })


//     .then(() => {
//       objValues.map((limits) => {
//         latitudesArray.push(Number(limits.lat))
//         longitudesArray.push(Number(limits.lng))
//       })
//     })

//   //   .then(() => {
//   //     setSouthWestLatitude(latitudesArray.sort()[0]);
//   //     setSouthWestLongitude(longitudesArray.sort()[0]);
//   //     setNorthEastLatitude(latitudesArray.sort()[latitudesArray.length - 1]);
//   //     setNorthEastLongitude(longitudesArray.sort()[longitudesArray.length - 1]);


//   //     console.log("here", southWestLatitude, southWestLongitude, northEastLatitude, northEastLongitude)

//   //     // setBounds([[1,2], [3,4]])

//   //     console.log("bounds in parent", bounds)
//   //   })


//   }, [])

//   console.log("objval", objValues)
//   console.log("array", latitudesArray, longitudesArray)

//   // objValues.map((limits) => {
//   //   console.log("limits", limits)
//   //         // latitudesArray.push(Number(limits.lat))
//   //         // longitudesArray.push(Number(limits.lng))
//   //       })

//   // useEffect(() => {
//   //   let isMounted = true;
//   //   const controller = new AbortController(); //Supported by axios.

//   //   const getPoints = async () => {
//   //     try {
//   //       const res = await axios.get(`http://localhost:3500/points`, {
//   //         signal: controller.signal
//   //       });
//   //       console.log("res.data", res.data);
//   //       // console.log("obj val res dat", Object.values(res.data))
//   //       isMounted && setObjValues(Object.values(res.data));

//   //       try {
//   //         objValues.map((limits) => {
//   //           // console.log("limits", limits)
//   //           latitudesArray.push(Number(limits.lat))
//   //           longitudesArray.push(Number(limits.lng))
//   //         })
//   //         console.log("arrays", longitudesArray, latitudesArray)
//   //       } catch (error) {
//   //         console.log(error)
//   //       }

//   //     } catch (err) {
//   //       console.error(err)
//   //     }
//   //   }

//   //   getPoints();
//   //   // console.log(steps)



//   //   return () => {
//   //     isMounted = false;
//   //     controller.abort();
//   //   }
//   // }, [])




//   return (
//     // <RideMap bounds={bounds}/>
//     <>Ridemap</>
//   )
// }