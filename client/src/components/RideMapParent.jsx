import { useEffect, useState } from "react"
import axios from 'axios'
import RideMap from "./RideMap";

export default function RideMapParent() {

  const [objValues, setObjValues] = useState({})
  const [setBounds, setSetBounds] = useState(0)



useEffect(() => {

  console.log("setsetbounds", setBounds)

  axios.get(`http://localhost:3500/points`)
  .then(function (res) {
    console.log("res data", res.data)
    setObjValues(Object.values(res.data))
    console.log("objValues in parent", objValues)
  })



  .then(function() {
    objValues.map((limits) => {
      // console.log("limits longitude", limits.lng)
      // console.log("limits latitude", limits.lat)
    })
  }



  )


}, [setBounds])





  return (
    <RideMap objValues={objValues} setSetBounds={setSetBounds}/>
  )
}