import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";


const AllRides = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/rides');
        if (isMounted) {
          setRides(response.data);

          console.log("response.data", response.data)
          setIsLoading(false);
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
  }, []);

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
    <div key={ride.id}>
      <div>Name: {ride.name}</div>
      <div>Details: {ride.details}</div>
      <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
      <div>Time: {ride.starting_time}</div>
      <div>Speed (Km/h): {ride.speed}</div>
      <div>Details: {ride.name}</div>
    </div>
  );
})}


        </div>
      )}
    </div>
  );
};

export default AllRides;
