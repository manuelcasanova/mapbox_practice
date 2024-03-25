import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";


//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'


const RidesUser = () => {
  const [rides, setRides] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRides, setAddToMyRides] = useState([])
  const { user } = useAuth();
  const id = user ? user.id : null;
  const userId = id
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

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


  useEffect(() => {
    const fetchUserRides = async () => {
      try {
        const response = await axios.get('http://localhost:3500/rides/otherusers', {
          params: {
            userId
          }
        });
        // Check if the response data is not an empty array before updating the state
        if (Array.isArray(response.data) && response.data.length > 0) {
          setUserRides(response.data);
        } else {
          setUserRides([])
        }
      } catch (error) {
        console.error('Error fetching user rides:', error);
      }
    };

    fetchUserRides();
  }, [userId, addToMyRides]);

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

                    {userRides.length ?
                      <div>
                        <div>{userRides.filter(obj => obj.isprivate && obj.ride_id === ride.id).length} joined this ride privately</div>
                        <div>{userRides.filter(obj => !obj.isprivate && obj.ride_id === ride.id).length} joined this ride publicly:</div>

                        <div>
                          {userRides
                            .filter(userRide => !userRide.isprivate) // Filter out rides where isPrivate is false
                            .filter(userRide => userRide.ride_id === ride.id) // Filter userRides for the specific ride
                            .map(userRide => {
                              const user = users.find(user => user.id === userRide.user_id);
                              return user ? user.username : ""; // Return username if user found, otherwise an empty string
                            })
                            .join(', ')
                          }


                        </div>
                      </div>
                      :
                      <div>No users have joined this ride</div>

                    }
                  
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
