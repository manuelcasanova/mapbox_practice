import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
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
  const axiosPrivate = useAxiosPrivate()
  const userLoggedin = auth.userId
  const isLoggedIn = auth.loggedIn

  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [mapId, setMapId] = useState(null)
  const userId = auth.userId;
  const [isLoading, setIsLoading] = useState(true);
  const [done, setDone] = useState(false)
  const [fake, setFake] = useState(true)
  const BACKEND = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([])

  useEffect(() => {
  }, [fromButton])

  useEffect(() => {

  }, [mapId])

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    fetchMutedUsers(auth, userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false;
    };
  }, [auth, isLoggedIn, userLoggedin]);


  const parseIntMapId = parseInt(mapId)

  const editAllowed = maps.some(obj => obj.createdby === auth.userId && obj.id === parseIntMapId);

  const navigate = useNavigate();



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();


    const fetchData = async () => {


      try {
        const response = await axiosPrivate.get(`${BACKEND}/maps`, {
          params: { userId },
          signal: controller.signal
        });

        if (isMounted) {
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
        if (!controller.signal.aborted) {
          console.error('Fetch error:', error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, fake, mutedUsers, BACKEND]);


  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  {map.title},         {`by: ${users.find(user => user.id === map.createdby)?.username || "Unknown User"
                    } `}
                </option>
              ))}
            </select>}


          <DrawMap maps={maps} setMaps={setMaps} editAllowed={editAllowed} mapId={mapId} setMapId={setMapId} fake={fake} setFake={setFake} fromButton={fromButton} users={users} />

          <div className="all-maps-text -step3">

            {fromButton ?
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
