import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'

const MapsPublic = () => {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyMaps, setAddToMyMaps] = useState([])
  const [userMaps, setUserMaps] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in createdby
  const { user } = useAuth();

  const userId = user.id;
  const userIsLoggedIn = user.loggedIn;

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

  // console.log("users in Maps Public", users)

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before API call
        const response = await axios.get('http://localhost:3500/maps/public', {
          params: {
            user: user
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
  }, [user]);

  useEffect(() => {
    const fetchUserMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps/otherusers', {
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
      await axios.post(`http://localhost:3500/maps/adduser`, {
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
      await axios.delete(`http://localhost:3500/maps/removeuser`, {
        data: {userId, userIsLoggedIn, mapId}
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
    <div>
      {maps.length === 0 ? (
        <div>No maps available.</div>
      ) : (
        <>
          {user.loggedIn ? (

            <div>

              {maps.map((map, index) => {


                // Extract the date formatting logic here
                // const originalDate = map.starting_date;
                // const formattedDate = formatDate(originalDate);



                // Determine if the logged-in user is the creator of this map
                const isUserMap = map.createdby === userId;

                // Determine if the logged-in user is already in this map


                // const isUserInMap = userMaps.some(userMap => userMap.user_id === userId);
                const isUserInMap = userMaps.some(userMap => userMap.user_id === user.id && userMap.map_id === map.id);

                // console.log("is user in map", isUserInMap)
                // Render the JSX elements, including the formatted date
                return (


                  <div key={map.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                    <div>Name: {map.title}</div>
                    <div>Created by: {
  users.find(user => user.id === map.createdby)?.username || "Unknown User"
}</div>


                    {/* {console.log(`The logged in user is ${userId}, the map id is ${map.id}, the owner of the map is ${map.createdby}, is ${userId} inside the map ${map.id}? According to the variable isUserInMap ${isUserInMap}`)} */}


                    {isUserMap ? (
                      <div></div>
                    ) : isUserInMap ? (


                      <button onClick={(e) => removeFromMap(e, index, map.id)}>Remove from my maps</button>
                    ) : (
                      <button onClick={(e) => addToMap(e, index, map.id)}>Add to my maps</button>
                    )}
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
    </div>
  );
};

export default MapsPublic;
