
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PreviewMap from './PreviewMap';

import useAuth from "../hooks/useAuth"

import '../styles/MapsPublic.css'

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchMaps from './util_functions/FetchMaps';

//Components
import MapFilter from './MapFilter';

import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/Navbar.css'


const MapsPublic = () => {
  const [maps, setMaps] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState(null)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyMaps, setAddToMyMaps] = useState([])
  const [userMaps, setUserMaps] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in createdby
  const [showAllMaps, setShowAllMaps] = useState(false)
  const { auth } = useAuth();
  const BACKEND = process.env.REACT_APP_API_URL;


  const [showFilter, setShowFilter] = useState(false)

  const defaultFilteredMaps = {
    userName: 'all',
    title: 'all'
  }
  
    const [filteredMaps, setFilteredMaps] = useState(defaultFilteredMaps);

// console.log("filtered maps", filteredMaps)

    const onFilter = (filters) => {
      setFilteredMaps(filters)
    };

  const handleShowMaps = () => {
    setShowAllMaps(prev => !prev)
  }

  const handleShowThisMap = (mapId) => {
    if (selectedMapId === mapId) {
      setSelectedMapId(null); // Hide the map if already shown
    } else {
      setSelectedMapId(mapId); // Show the map
    }
  };

  // console.log("maps", maps)
  // console.log("user in MapsPublic", user)
  const userId = auth.userId
  const userIsLoggedIn = auth.loggedIn;
  const isLoggedIn = userIsLoggedIn;
  const userLoggedin = auth.userId

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  // console.log("users in Maps Public", users)

  useEffect(() => {
    let isMounted = true;
    fetchMaps(auth, setMaps, setAddToMyMaps, setIsLoading, setError, isMounted, filteredMaps); // Call fetchMaps function
    return () => {
      isMounted = false;
    };
  }, [auth, filteredMaps]);

  useEffect(() => {
    const fetchUserMaps = async () => {
      try {
        const response = await axios.get(`${BACKEND}/maps/otherusers`, {
          params: {
            userId
          }
        });
        // Check if the response data is not an empty array before updating the state
        if (Array.isArray(response.data) && response.data.length > 0) {
          setUserMaps(response.data);
        } else {
          setUserMaps([])
        }
      } catch (error) {
        console.error('Error fetching user maps:', error);
      }
    };

    fetchUserMaps();
  }, [userId, addToMyMaps]);


  const toggleAddToMyMaps = (index) => {
    //  console.log("add to my maps before", addToMyMaps);
    setAddToMyMaps(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      //  console.log("add to my maps after", newState); // Log the updated state
      return newState;
    });
  };


  //Function to add user to map
  const addToMap = async (e, index, mapId) => {
    e.preventDefault();
    try {
      // console.log("Adding to map...");
      await axios.post(`${BACKEND}/maps/adduser`, {
        userId, userIsLoggedIn, mapId
      });
      // console.log("Successfully added to map.");
      toggleAddToMyMaps(index); // Toggle state for the clicked map
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    }
  };


  //Function to remove user from map
  const removeFromMap = async (e, index, mapId) => {
    e.preventDefault();
    try {
      // console.log("Adding to map...");
      await axios.delete(`${BACKEND}/maps/removeuser`, {
        data: { userId, userIsLoggedIn, mapId }
      });
      // console.log("Successfully added to map.");
      toggleAddToMyMaps(index); // Toggle state for the clicked map
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    }
  };

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }

  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
{!showFilter &&
        <button title="Filter" className='rides-public-filter-ride'
          onClick={() => handleShowFilter()}
        > <FontAwesomeIcon icon={faSliders} /></button>}

{showFilter &&
          <MapFilter onFilter={onFilter} handleShowFilter={handleShowFilter}  />
        }

      {maps.length === 0 ? (
        <>
        <div className='users-title'>Maps</div>
        <div>No maps available.</div>
        </>
      ) : (
        <div className='maps-container'>
          <div className='users-title'>Maps</div>
          {/* <button 
          className='orange-button'
          onClick={handleShowMaps}>{showAllMaps ? 'Hide all maps' : 'Show all maps'}</button> */}



          {auth.accessToken !== undefined ? (

            <div>

              {maps.map((map, index) => {


                // Extract the date formatting logic here
                // const originalDate = map.starting_date;
                // const formattedDate = formatDate(originalDate);



                // Determine if the logged-in user is the creator of this map
                const isUserMap = map.createdby === userId;

                // Determine if the logged-in user is already in this map
                // console.log("userMaps", userMaps)

                // const isUserInMap = userMaps.some(userMap => userMap.user_id === userId);
                const isUserInMap = userMaps.some(userMap => userMap.user_id === auth.userId && userMap.map_id === map.id);

                // console.log("is user in map", isUserInMap)
                // Render the JSX elements, including the formatted date
                return (



                  <div className="maps-public-container" key={`${map.createdat}-${map.createdby}`}>

                    <div className='maps-public-information'>
                    <div className='show-maps-button'>
                    <button 
                    className='orange-button'
                    onClick={() => handleShowThisMap(map.id)}>
  {selectedMapId === map.id ? '-' : '+'}
</button>
</div>
                      <div className='maps-public-map-name'>{map.title}</div>
                      {!isUserMap ? (
                        <div className='maps-public-createdby'>

                          {` (creator: ${users.find(user => user.id === map.createdby)?.username || "Unknown User"
                            })`}

                        </div>) :
                        <div className='maps-public-createdby'>(creator: me)</div>
                      }


                      {/* {console.log(`The logged in user is ${userId}, the map id is ${map.id}, the owner of the map is ${map.createdby}, is ${userId} inside the map ${map.id}? According to the variable isUserInMap ${isUserInMap}`)} */}


                      {isUserMap ? (
                        <div></div>
                      ) : isUserInMap ? (
                        <button className='maps-public-remove-button' onClick={(e) => removeFromMap(e, index, map.id)}>Remove from my maps</button>
                      ) : (
                        <button className='maps-public-add-button' onClick={(e) => addToMap(e, index, map.id)}>Add to my maps</button>
                      )}

                    </div>



                    {showAllMaps && map.id && map.id !== null && <PreviewMap mapId={map.id} selectedMapId={selectedMapId} handleShowThisMap={handleShowThisMap} />}

                    {selectedMapId === map.id && <PreviewMap mapId={map.id} selectedMapId={selectedMapId} handleShowThisMap={handleShowThisMap} />}



                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see maps.</p>
          )}
        </div>
      )}
    </>
  );
};

export default MapsPublic;
