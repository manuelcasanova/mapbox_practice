import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import DrawMap from "./DrawMap";

export default function AllMaps({ fromButton, setFromButton }) {
  const { user } = useAuth();
  const [maps, setMaps] = useState([]);
  const [mapId, setMapId] = useState(null) //Declare it here instead of bringin from useAuth
  const userId = user.id;
  const [isLoading, setIsLoading] = useState(true);
  const [done, setDone] = useState(false)
  const [fake, setFake] = useState(true)

// console.log("done", done)
  useEffect(() => {
  // console.log("user", user.id)
  // console.log("mapId All Maps", mapId)
  // console.log("userId ALlMaps", userId)
 // console.log("maps all maps", maps)
  }, [mapId])



const parseIntMapId = parseInt(mapId)

  const editAllowed = maps.some(obj => obj.createdby === user.id && obj.id === parseIntMapId);

  const navigate = useNavigate();



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', {
          params: { userId },
          signal: controller.signal
        });
        // console.log("response data", response.data)
        if (isMounted) {
          setMaps(response.data);
          // Set the initial mapId to the id of the first map if available
          if (response.data.length > 0) {
            setMapId(response.data[0].id);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, fake]);



  if (!user.loggedIn) {
    return <p>Please log in to view maps</p>;
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : maps.length > 0 ? (
        <>

          {fromButton &&
            <select
              className="allmaps"
              value={mapId}
              onChange={(e) => setMapId(e.target.value)}
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  Id: {map.id}, Title: {map.title}, Created by: {map.createdby}
                </option>
              ))}
            </select>}

          {
            !editAllowed ? (
              <div>Only users that created a map can modify them</div>
            ) : (
            fromButton ?
              <div>Add, edit or remove markers</div> :
              <div>STEP 2: Add, edit or remove markers</div>
            )
          }



          <DrawMap maps={maps} setMaps={setMaps} editAllowed={editAllowed} mapId={mapId} setMapId={setMapId} fake={fake} setFake={setFake} />


          {!fromButton &&
            // <div className="mapslist">
            //   {maps.map((map) => (
            //     <div key={map.id}>
            //       Id: {map.id}, Title: {map.title}, Created by: {map.createdby}
            //       {/* Only show de Delete button if user.id === map.createdby */}
            //       {userId === map.createdby ?
            //       <button onClick={() => deleteMap(map.id)}>Delete</button> :
            //       <button onClick={() => removeFromMyMaps(map.id)}>Remove from my maps</button>
            //      }
            //     </div>
            //   ))}
            // </div> :
            <div>
              {!done && <button
                onClick={() => setDone(prev => !prev)}
              >Done</button>}



            </div>

          }

          {done && <div>STEP 3:
            <button
              onClick={() => {
                navigate("/ride");
              }}
            >Create a ride with the new map</button>
            <button
              onClick={() => {
                setFromButton(true)
                navigate("/maps");
                setDone(true)
              }}
            >Manage all maps</button>
            <button
              onClick={() => {
                navigate("/");
              }}
            >Home</button>

          </div>}

        </>
      ) : (
        <p>No maps to display</p>
      )}

    </>
  );
}
