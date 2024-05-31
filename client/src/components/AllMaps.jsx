import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import DrawMap from "./DrawMap";

import '../styles/AllMaps.css'

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'



export default function AllMaps({ fromButton, setFromButton, rideApp }) {
  const { auth } = useAuth();
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [mapId, setMapId] = useState(null) //Declare it here instead of bringin from useAuth
  const userId = auth.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [done, setDone] = useState(false)
  const [fake, setFake] = useState(true)
  const BACKEND = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in createdby

  
  useEffect(()=> {
    // console.log("from button", fromButton)
  }, [fromButton])


  // console.log("done", done)
  useEffect(() => {
    // console.log("user", user.id)
    // console.log("mapId All Maps", mapId)
    // console.log("userId ALlMaps", userId)
    // console.log("maps all maps", maps)
  }, [mapId])

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);


  const parseIntMapId = parseInt(mapId)

  const editAllowed = maps.some(obj => obj.createdby === auth.userId && obj.id === parseIntMapId);

  const navigate = useNavigate();



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/maps`, {
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



  if (!auth.accessToken || auth.accessToken === undefined) {
    return <p>Please log in to view maps</p>;
  }

  return (
    <div className="all-maps-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : maps.length > 0 ? (
        <>

          {fromButton &&
            <select
              className="all-maps-select"
              value={mapId}
              onChange={(e) => setMapId(e.target.value)}
            >
              {maps.map((map) => (
                <option key={`${map.createdat}-${map.createdby}`} value={map.id}>
                  {map.title},         {`by: ${
                        users.find(user => user.id === map.createdby)?.username || "Unknown User"
                      } `}
                </option>
              ))}
            </select>}

          {
            !editAllowed ? (
              <div className="all-maps-text">
                {/* Cannot modify a map created by other user. */}
                </div>
            ) : (
              fromButton ?
                <div className="all-maps-text">Add, edit or remove markers</div> :
                <div className="all-maps-text">STEP 2: Add, edit or remove markers</div>
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
              {/* {!done && <button
                onClick={() => setDone(prev => !prev)}
              >Done</button>} */}



            </div>

          }

          {/* {done &&  */}
          <div className="all-maps-text -step3">
            
         { fromButton ?
                <></> :
                <div className="all-maps-text">STEP 3:</div>
      }
     


            <button
            className="all-maps-button"
              onClick={() => {
                if (rideApp) {
                  navigate('/createride');
                } else {
                  navigate('/createrun');
                }
              }}
            >
              Create a {rideApp ? 'ride' : 'run'}
              </button>
            <button
            className="all-maps-button"
              onClick={() => {
                setFromButton(true)
                navigate("/maps");
                setDone(true)
              }}
            >Manage all maps</button>
            <button
            className="all-maps-button"
              onClick={() => {
                if (rideApp) {
                  navigate('/rides/public');
                } else {
                  navigate('/runs/public');
                }
              }}
            >Home</button>

          </div>
          {/* } */}

        </>
      ) : (
        <p>No maps to display</p>
      )}

    </div>
  );
}
