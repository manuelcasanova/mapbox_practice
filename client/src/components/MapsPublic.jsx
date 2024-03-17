import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

const MapsPublic = () => {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyMaps, setAddToMyMaps] = useState([])
  const [userMaps, setUserMaps] = useState([]);
  const { user } = useAuth();

console.log("userMaps", userMaps)

  // console.log("addtomymaps", addToMyMaps)

const userId = user.id;
const userIsLoggedIn = user.loggedIn;

  useEffect(() => {
    // console.log("add to my maps", addToMyMaps)
  }, [addToMyMaps])

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
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
  }, []);

  useEffect(() => {
    const fetchUserMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps/otherusers', {
          params: {
            userId: userId
          }
        });
        console.log("responsedata", response.data)
        setUserMaps(response.data);
      } catch (error) {
        console.error('Error fetching user maps:', error);
      }
    };

    fetchUserMaps();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

    // Function to toggle addToMyMaps state for a specific map index
    const toggleAddToMyMaps = (index) => {
      setAddToMyMaps(prevState => {
        const newState = [...prevState];
        newState[index] = !newState[index];
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
                const originalDate = map.starting_date;
                const formattedDate = formatDate(originalDate);
 


                      // Determine if the logged-in user is the creator of this map
      const isUserMap = map.createdby === userId;


      // Determine if the logged-in user is already in this map
      const isUserInMap = userMaps.some(userMap => userMap.map_id === map.id);

     
                // Render the JSX elements, including the formatted date
                return (


                  <div key={map.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
                    
                    <div>Name: {map.title}</div>
                    <div>Created by: {map.createdby}</div>

{console.log("isUserMap", isUserMap)}
{console.log("isUserInMap", isUserInMap)}

                    {isUserMap ? (
                      <div></div>
                    ) : isUserInMap ? (

                
                      <button onClick={(e) => addToMap(e, index, map.id)}>Remove from my maps</button>
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
