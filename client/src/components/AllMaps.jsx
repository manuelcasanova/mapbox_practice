import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import DrawMap from "./DrawMap";

export default function AllMaps() {

  const [maps, setMaps] = useState();
  const [mapId, setMapId] = useState(1);
  const [selected, setSelected] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); //Supported by axios.

    const getMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', {
          signal: controller.signal
        });
         console.log(response.data);
        isMounted && setMaps(response.data);
        //In case all maps are deleted, we use this first state for mapId
        isMounted && setMapId(response.data[0].id)
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

const handleSelect = async () => {
  setSelected(old => !old)

  try {
console.log("selected, unselected")
  } catch (err) {
    console.error(err)
  }
}

function deleteMap(id) {
  return axios.delete(`http://localhost:3500/delete/${id}`)
  .then(res => {
    setMaps(maps.filter(map => map.if !== id))
    console.log(`Map with ${id} id deleted`)
  })
  .then(
    navigate("/")
  )
}

  return (
    <>
      {maps?.length
        ?
        <select 
        className="allmaps"
        value={mapId}
        onChange={(e) => setMapId(e.target.value)}
        >
          {maps.map((map, index) =>
          
            <option 
            key={index}
            value={map.id}
            >
              {/* {console.log("mapid", map.id)} */}
              Id: {map.id}
              Title: {map.title}
              Created by: {map.createdby}
            </option>
          )}
        </select>
        
        :
        <p>No maps to display</p>
      }
      <div>STEP 2: Add, edit or remove markers</div>
      <DrawMap mapId={mapId}/>
      {maps?.length
        ?
        <div 
        className="mapslist"
        >
          {maps.map((map, index) =>
          <>
                      <div 
            key={index}
            value={map.id}
            >
              {/* {console.log("mapid", map.id)} */}
              Id: {map.id}
              Title: {map.title}
              Created by: {map.createdby}
            </div>
            {map.id !== 1 &&
<button
//onClick={() => {console.log("Delete clicked")}}
// onClick={() => {setConfirmDelete(old => !old)}}
onClick={() => {
  deleteMap(map.id)
  }}
>Delete</button>
}

            {/* <input
    title="Select to delete"
      type='checkbox'
      value={selected}
      // onClick={() => { step.step_is_selected === false ? select() : unselect() }}
      onClick={() => {handleSelect() }}
    ></input> */}

{/* {confirmDelete && <div>Are you sure?</div>} */}

          </>

          )}
        </div>
        
        :
        <p>No maps to display</p>
      }
    </>

  )
}