import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

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

  const deleteRide = async (id) => {
    try {
      const userId = user.id;
      // console.log("deleteRide", userId)
    const rideCreatedBy = rides.find(ride => ride.id === id).createdby;
      await axios.delete(`http://localhost:3500/ride/delete/${id}`, {
        data: {userId, rideCreatedBy}
      });
      setRides(rides.filter(ride => ride.id !== id));
      // console.log(`Ride with ${id} id deleted`);
      // navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromMyRides = async (id) => {
    try {
      const userId = user.id;
      const rideId = id;
      // console.log("remove from my rides", userId, rideId)
      await axios.delete(`http://localhost:3500/rides/delete/users/${id}`, {
        data: {userId}
      });
      setRides(rides.filter(ride => ride.id !== id)); 
      // console.log(`Ride with ${id} id deleted`);
      // navigate("/");
    } catch (error) {
      console.error(error);
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
                  
                    {/* {console.log(user.id, ride.createdby)} */}
                    {user.id === ride.createdby ?
                  <button
                   onClick={() => deleteRide(ride.id)}
                   >Delete</button> :
                  <button 
                  onClick={() => removeFromMyRides(ride.id)}>Remove from my rides
                  </button>
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
