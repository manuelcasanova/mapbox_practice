import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import DrawMap from "./DrawMap";

import '../styles/AllMaps.css'

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchMutedUsers from "./util_functions/FetchMutedUsers";



export default function AllMaps({ fromButton, setFromButton, rideApp }) {
  const { auth } = useAuth();
  const userLoggedin = auth.userId
  const isLoggedIn = auth.loggedIn

  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [mapId, setMapId] = useState(null) //Declare it here instead of bringin from useAuth
  const userId = auth.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [done, setDone] = useState(false)
  const [fake, setFake] = useState(true)
  const BACKEND = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in createdby
const [mutedUsers, setMutedUsers] = useState([])
  // console.log("muted users in All maps", mutedUsers)
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
    fetchMutedUsers(userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
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
  
        if (isMounted) {
          // Filter maps based on mutedUsers involving userId
          const filteredMaps = response.data.filter(map => {
            // Check if map's createdby is muter or mutee when userId is involved
            let muterMuted = mutedUsers.some(mutedUser => {
              return mutedUser.muter === userId && map.createdby === mutedUser.mutee;
            });
  
            let muteeMuted = mutedUsers.some(mutedUser => {
              return mutedUser.mutee === userId && map.createdby === mutedUser.muter;
            });
  
            // Include the map if it's not related to a mutedUser involving userId
            return !(muterMuted || muteeMuted);
          });
  
          setMaps(filteredMaps);
  
          // Set the initial mapId to the id of the first map if available
          if (filteredMaps.length > 0) {
            setMapId(filteredMaps[0].id);
          }
  
          setIsLoading(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) { // Check if the request was aborted
          console.error('Fetch error:', error);
          setIsLoading(false); // Set loading state appropriately
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, fake, mutedUsers]); 
  



  if (!auth.accessToken || auth.accessToken === undefined) {
    return <p>Please log in to view maps</p>;
  }

  return (
    <div className="all-maps-container">
      {isLoading ? (
        <div className="loading"></div>
      ) : maps.length > 0 ? (
        <>

          {fromButton &&
            <select
              className="all-maps-select"
              value={mapId}
              onChange={(e) => setMapId(e.target.value)}
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.title},         {`by: ${
                        users.find(user => user.id === map.createdby)?.username || "Unknown User"
                      } `}
                </option>
              ))}
            </select>}

{/* 
          {
            !editAllowed ? (
              <div className="all-maps-text">
                 Cannot modify a map created by other user. 
                </div>
            ) : (
              fromButton ?
                <div className="all-maps-text">Add, edit or remove markers</div> :
                <div className="all-maps-text">STEP 2: Add, edit or remove markers</div>
            )
          } */}



          <DrawMap maps={maps} setMaps={setMaps} editAllowed={editAllowed} mapId={mapId} setMapId={setMapId} fake={fake} setFake={setFake} fromButton={fromButton} users={users}/>


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
