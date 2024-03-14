import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

const RidesAll = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/rides/', {
          params: {
            user: user 
          }
        });
        if (isMounted) {
          setRides(response.data);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {rides.length === 0 ? (
        <div>No rides available.</div>
      ) : (
        <>
        {user.loggedIn && user.isAdmin ? (
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
      {ride.map && ride.map !== null && <PreviewMap mapId={ride.map} />}
    </div>
  );
})}


        </div>
            ) : (
              <p>Please log in as an administrator to see rides.</p>
            )}
          </>
      )}
    </div>
  );
};

export default RidesAll;