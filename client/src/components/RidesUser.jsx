import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

const RidesUser = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const id = user ? user.id : null;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (id !== null && id !== undefined) {
          const response = await axios.get(`http://localhost:3500/rides/user/${id}`);
          if (isMounted) {
            setRides(response.data);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id !== null && id !== undefined) {
      fetchData();
    } else {
      setIsLoading(false); // If user is not logged in, set isLoading to false immediately
    }

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {user.loggedIn ? (
        <div>
          {rides.length === 0 ? (
            <div>No rides available.</div>
          ) : (

            <div>
              {rides.map(ride => {
                // Extract the date formatting logic here
                const originalDate = ride.starting_date;
                const formattedDate = formatDate(originalDate);

                // Render the JSX elements, including the formatted date
                return (
                  <div key={ride.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
                    <div>Name: {ride.name}</div>
                    <div>Details: {ride.details}</div>
                    <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
                    <div>Time: {ride.starting_time}</div>
                    <div>Distance: {ride.distance} km</div>
                    <div>Speed: {ride.speed} km/h</div>
                    <div>Meeting Point: {ride.meeting_point}</div>
                    <div>Created By: {ride.createdby}</div>
                  
                    {console.log(user.id, ride.createdby)}
                    {user.id === ride.createdby ?
                  <button
                  //  onClick={() => deleteMap(map.id)}
                   >Delete</button> :
                  <button 
                  // onClick={() => removeFromMyMaps(map.id)}
                  >Remove from my rides</button>
                 }
              
                    {ride.map && ride.map !== null && ride.map !== undefined && <PreviewMap mapId={ride.map} />}
          
                  </div>
                );
              })}
            </div>

          )}
        </div>
      ) : (
        <p>Please log in to see rides.</p>
      )}
    </>
  );
};

export default RidesUser;
