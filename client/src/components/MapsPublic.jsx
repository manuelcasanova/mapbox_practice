import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

const MapsPublic = () => {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyMaps, setAddToMyMaps] = useState(true)
  const { user } = useAuth();

  useEffect (() => {
    console.log("add to my maps", addToMyMaps)
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  //Function to add user to map
  const addToMap = async (e) => {
    e.preventDefault();
    try {
      console.log("Adding to map...");
      await axios.post(`http://localhost:3500/maps/adduser`, {
        user
      });
      console.log("Successfully added to map.");
      setAddToMyMaps(false)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred");
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
          {addToMyMaps && 
          <button
          onClick={(e) => addToMap(e)}
          >Add to my maps</button>
          }
           {!addToMyMaps && 
          <button
          onClick={() => setAddToMyMaps(true)}
          >Remove from my maps</button>
          }
{maps.map(map => {


  // Extract the date formatting logic here
  const originalDate = map.starting_date;
  const formattedDate = formatDate(originalDate);



  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={map.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
      <div>Name: {map.title}</div>
      <div>Created by: {map.createdby}</div>

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
