import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";
import RidesFilter from './RidesFilter';


//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'

const RidesPublic = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRides, setAddToMyRides] = useState([])
  const [userRides, setUserRides] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by
  const { user } = useAuth();
// console.log("user", user)
  //  console.log("rides", rides)

  // console.log("userRides", userRides) //{ride_id: 2, user_id: 2, isprivate: true}

  // console.log("rides", rides)
  // console.log("users", users)

  const userId = user.id;
  const userIsLoggedIn = user.loggedIn;

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
        const response = await axios.get('http://localhost:3500/rides/public', {
          params: {
            user: user
          }
        });
        if (isMounted) {
          // Initialize addToMyMaps state with false for each map
          setAddToMyRides(new Array(response.data.length).fill(false));
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
  }, []);

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


  const toggleAddToMyRides = (index) => {
    //  console.log("add to my rides before", addToMyRides);
    setAddToMyRides(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      //  console.log("add to my rides after", newState); // Log the updated state
      return newState;
    });
  };

  //Function to add user to ride
  const addToRide = async (e, index, rideId, isPrivate) => {
    e.preventDefault();
    try {
      // console.log("Adding to ride...");
      await axios.post(`http://localhost:3500/rides/adduser`, {
        userId, userIsLoggedIn, rideId, isPrivate
      });
      // console.log("Successfully added to ride.");
      toggleAddToMyRides(index); // Toggle state for the clicked ride
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    }
  };


  //Function to remove user from ride
  const removeFromRide = async (e, index, rideId) => {
    e.preventDefault();
    try {
      // console.log("Adding to map...");
      await axios.delete(`http://localhost:3500/rides/removeuser`, {
        data: { userId, userIsLoggedIn, rideId }
      });
      // console.log("Successfully added to map.");
      toggleAddToMyRides(index); // Toggle state for the clicked map
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
      {rides.length === 0 ? (
        <div>No rides available.</div>
      ) : (
        <>
          {user.loggedIn ? (
            <div>
              <RidesFilter />
              {rides.map((ride, index) => {
                // Extract the date formatting logic here
                const originalDate = ride.starting_date;
                const formattedDate = formatDate(originalDate);


                // Determine if the logged-in user is the creator of this ride
                const isUserRide = ride.createdby === userId;


                // Determine if the logged-in user is already in this ride


                // const isUserInMap = userMaps.some(userMap => userMap.user_id === userId);
                const isUserInRide = userRides.some(userRide => userRide.user_id === user.id && userRide.ride_id === ride.id);

                // console.log("is use in ride?", isUserInRide)
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
                    <div>Created By: {
                      users.find(user => user.id === ride.createdby)?.username || "Unknown User"
                    }</div>

                    {userRides.length ?
                      <div>
                        <div>{userRides.filter(ride => ride.isprivate).length} joined this ride privately</div>
                        <div>{userRides.filter(ride => !ride.isprivate).length} joined this ride publicly:</div>

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



                    {isUserRide ? (
                      <div></div>
                    ) : isUserInRide ? (


                      <button onClick={(e) => removeFromRide(e, index, ride.id)}>Remove from my rides</button>

                    ) : (
                      <div>
                      <button onClick={(e) => addToRide(e, index, ride.id, true)}>Join ride privately</button>
                      <button onClick={(e) => addToRide(e, index, ride.id, false)}>Join ride publicly</button>
                      </div>
                    )}



                    {ride.map && ride.map !== null && <PreviewMap mapId={ride.map} />}
                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see rides.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RidesPublic;
