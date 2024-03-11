import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const id = user.id;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (id !== null && id !== undefined) {
          const response = await axios.get(`http://localhost:3500/rides/user/${id}`);
          if (isMounted) {
            setRides(response.data);
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setIsLoading(false);
        }
      }
    };

    fetchData();

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
              <>
                {user.loggedIn ? (
                  <div key={ride.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>

                    <div>Name: {ride.name}</div>
                    <div>Details: {ride.details}</div>
                    <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
                    <div>Time: {ride.starting_time}</div>
                    <div>Speed (Km/h): {ride.speed}</div>
                    <div>Details: {ride.name}</div>
                    <div>Created By: {ride.createdby}</div>
                    <PreviewMap mapId={ride.map} />

                  </div>
                ) : <div>Please, log in to access see rides</div>}
              </>
            );
          })}


        </div>
      )}
    </div>
  );
};

export default MyRides;
