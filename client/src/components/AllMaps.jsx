import axios from "axios"
import { useEffect, useState } from "react"
import DrawMap from "./DrawMap";

export default function AllMaps() {

  const [maps, setMaps] = useState();
  const [mapId, setMapId] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); //Supported by axios.

    const getMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', {
          signal: controller.signal
        });
        // console.log(response.data);
        isMounted && setMaps(response.data);
      } catch (err) {
        console.error(err)
      }
    }

    getMaps();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

// console.log("mapid", mapId)

  return (
    <>
    <div>Or select an existing map</div>
      {maps?.length
        ?
        <select 
        className="allmaps"
        onChange={(e) => setMapId(e.target.value)}
        >
          {maps.map((step, index) =>
          
            <option 
            key={index}
            value={step.id}
            >
              {/* {console.log("stepid", step.id)} */}
              Id: {step.id}
              Title: {step.title}
              Created by: {step.createdby}
            </option>
          )}
        </select>
        
        :
        <p>No maps to display</p>
      }
      <div>STEP 2: Add, edit or remove markers</div>
      <DrawMap mapId={mapId}/>
    </>

  )
}