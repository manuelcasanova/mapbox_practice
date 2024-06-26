import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import { useAuth } from "./Context/AuthContext";
import RidesFilter from './RidesFilter';


//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRideMessages from './util_functions/messaging/FetchRideMessages';
import AddRideMessage from './util_functions/messaging/AddRideMessage';
import MappedMessage from './util_functions/messaging/MappedMessage';

const RidesPublic = () => {
  const [rides, setRides] = useState([]);
  // console.log("Rides", rides)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRides, setAddToMyRides] = useState([])
  const [userRides, setUserRides] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by
  const [showUsers, setShowUsers] = useState(false)
  const { user } = useAuth();
  const [filteredRides, setFilteredRides] = useState();
  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  //  console.log("filteredRides", filteredRides)
  const userId = user.id;
  const userIsLoggedIn = user.loggedIn;


  //Function to get the filters from the child component RidesFilter.
  // FORMAT: {dateRange: {end: "Mar 27 2024, 17:00:00 GMT-0700 (Pacific Daylight Time", start: "Mar 28 2024, 17:00:00 GMT-0700 (Pacific Daylight Time"}, distanceRange: {min: 1, max: 100}, speedRange: {min: 10, max: 30}}


  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., rides) and update the state accordingly
    setFilteredRides(filters)
  };

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
            user: user,
            filteredRides
          }
        });
        if (isMounted) {
          // Initialize addToMyMaps state with false for each map
          setAddToMyRides(new Array(response.data.length).fill(false));
          setRides(response.data);
          setIsLoading(false);


          // Fetch messages for each ride
          const rideMessagesPromises = response.data.map(ride => fetchRideMessages(ride.id));
          const rideMessages = await Promise.all(rideMessagesPromises);
          setRides(prevRides => {
            return prevRides.map((ride, index) => {
              return { ...ride, messages: rideMessages[index] };
            });
          });
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
  }, [user, filteredRides, messageSent, messageDeleted, messageReported, messageFlagged]);

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

  // Function to format the current date as 'yyyy-mm-dd'
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const currentDateFormatted = getCurrentDateFormatted();

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

              <RidesFilter onFilter={onFilter} />

              {rides.map((ride, index) => {
                //  console.log("Ride ID:", ride.id);
                // Extract the date formatting logic here
                const originalDate = ride.starting_date;
                // console.log("original date", originalDate)

                const formattedDate = formatDate(originalDate);

                const isPastDate = formattedDate < currentDateFormatted;



                // console.log("isPastDate", isPastDate)


                // Determine if the logged-in user is the creator of this ride
                const isUserRide = ride.createdby === userId;


                // Determine if the logged-in user is already in this ride


                // const isUserInMap = userMaps.some(userMap => userMap.user_id === userId);
                const isUserInRide = userRides.some(userRide => userRide.user_id === user.id && userRide.ride_id === ride.id);



                // console.log("is use in ride?", isUserInRide)
                // Render the JSX elements, including the formatted date
                return (


                  <div key={`${ride.id}-${index}`} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
                    {/* {console.log("ride.id", ride.id)} */}
                    <div>Name: {ride.name}</div>
                    <div>Details: {ride.details}</div>
                    <div>Date: {formattedDate}</div>

                    {isPastDate && (
                      <div>This ride has already taken place</div>
                    )}
                    <div>Time: {ride.starting_time}</div>
                    <div>Distance: {ride.distance} km</div>
                    <div>Speed: {ride.speed} km/h</div>
                    <div>Meeting Point: {ride.meeting_point}</div>
                    <div>Created By: {
                      users.find(user => user.id === ride.createdby)?.username || "Unknown User"
                    }</div>



                    {userRides.length ?

                      <div>
                        <div>{userRides.length} joined this ride, {userRides.filter(obj => !obj.isprivate && obj.ride_id === ride.id).length} publicaly</div>

                        {/* <div>{userRides.filter(obj => obj.isprivate && obj.ride_id === ride.id).length} joined this ride privately</div>
  <div>{userRides.filter(obj => !obj.isprivate && obj.ride_id === ride.id).length} joined this ride publicly:</div> */}

                        {!showUsers && <div onClick={() => setShowUsers(!showUsers)}>+</div>}

                        {showUsers && <div onClick={() => setShowUsers(!showUsers)}>-</div>}

                        {showUsers &&
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
                        }
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

                    {/* {console.log("ride messages", ride.messages)} */}

                    {isUserInRide &&

                      <AddRideMessage userId={userId} userIsLoggedIn={userIsLoggedIn} rideId={ride.id} setMessageSent={setMessageSent} />
                    }
                    {ride.messages && isUserInRide && (
                      <div>
                        {ride.messages.map(message => (


                          message.status !== 'deleted' && (
                            <div>
                              {message.status === 'flagged' && message.createdby === userId && (
                                <div>
                                  <div>Flagged as inappropiate. Not visible for other users</div>
                                  <MappedMessage message={message} user={user} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                </div>
                              )}
                                                            {message.status === 'flagged' && message.createdby !== userId && (
                                <div>
                                  <div>Message concealed due to inappropiate content.

                                  <MappedMessage message={message} user={user} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                  </div>
                  
                                </div>
                              )}
                              {message.status !== 'flagged' && <MappedMessage message={message} user={user} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                            </div>
                          )
                        )
                        )}
                      </div>
                    )}

                    {ride.map && ride.map !== null ? <PreviewMap mapId={ride.map} /> : <div>This ride has no map. The map might have been deleted by the owner.</div>}
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
