
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"

import '../styles/MapsPublic.css'



//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'


const MapsPublic = () => {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyMaps, setAddToMyMaps] = useState([])
  const [userMaps, setUserMaps] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in createdby
  const { auth } = useAuth();
  const BACKEND = process.env.REACT_APP_API_URL;


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

    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before API call
        const response = await axios.get(`${BACKEND}/maps/public`, {
          params: {
            userId: userId
          }
        });
        if (isMounted) {
          // Initialize addToMyMaps state with false for each map
          setAddToMyMaps(new Array(response.data.length).fill(false));
          setMaps(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error)
          } else {
            setError(error.message)
          }
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {maps.length === 0 ? (
        <>
        <div className='users-title'>See maps</div>
        <div>No maps available.</div>
        </>
      ) : (
        <>
          <div className='users-title'>Maps</div>
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

                      <div className='maps-public-map-name'>Name: {map.title}</div>
                      {!isUserMap ? (
                        <div className='maps-public-createdby'>

                          {`by: ${users.find(user => user.id === map.createdby)?.username || "Unknown User"
                            } `}

                        </div>) :
                        <div className='maps-public-createdby'>(by: me)</div>
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

                    {map.id && map.id !== null && <PreviewMap mapId={map.id} />}



                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see maps.</p>
          )}
        </>
      )}
    </>
  );
};

export default MapsPublic;
