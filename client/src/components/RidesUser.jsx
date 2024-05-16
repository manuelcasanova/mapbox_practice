import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import RidesFilter from './RidesFilter';

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRideMessages from './util_functions/messaging/FetchRideMessages';
import AddRideMessage from './util_functions/messaging/AddRideMessage';
import MappedMessage from './util_functions/messaging/MappedMessage';
import { deactivateRide } from './util_functions/ride_functions/DeleteRide';
import { removeFromMyRides } from './util_functions/ride_functions/DeleteRide';


const RidesUser = () => {
  const [rides, setRides] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRides, setFilteredRides] = useState();
  const [addToMyRides, setAddToMyRides] = useState([])
  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  const [rideStatusUpdated, setRideStatusUpdated] = useState(false)

  // console.log("rides", rides)
  // console.log("filtered rides", filteredRides)

  // const [addToMyRides, setAddToMyRides] = useState([])
  const { auth } = useAuth();
  const userIsLoggedIn = auth.loggedIn;
  const id = auth ? auth.userId : null;
  const userId = id
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by
  const [confirmDelete, setConfirmDelete] = useState(false)
  // const navigate = useNavigate();

  // console.log("rides", rides)

  const isRideCreatedByUser = rides.find(ride => ride.createdby === auth.userId) !== undefined;
// console.log("isrcbyser", isRideCreatedByUser)
  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., rides) and update the state accordingly
    setFilteredRides(filters)
  };


  useEffect(() => {
    let isMounted = true;
    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (id !== null && id !== undefined) {
          const response = await axios.get(`http://localhost:3500/rides/user/${id}`, {
            params: {
              user: auth,
              filteredRides: filteredRides || ''
            }
          });

          if (isMounted) {
            setRides(response.data);
            setAddToMyRides(new Array(response.data.length).fill(false));
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

    if (id !== null && id !== undefined) {
      fetchData();
    } else {
      setIsLoading(false); // If user is not logged in, set isLoading to false immediately
    }

    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [id, filteredRides, messageSent, messageDeleted, messageReported, messageFlagged, rideStatusUpdated]);


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
  }, [userId
    // , addToMyRides
  ]);


  const removeFromMyRides = async (id) => {
    try {
      const userId = auth.userId;
      // const rideId = id;
      // console.log("remove from my rides", userId, rideId)
      await axios.delete(`http://localhost:3500/rides/delete/users/${id}`, {
        data: { userId }
      });
      setRides(rides.filter(ride => ride.id !== id));
      // console.log(`Ride with ${id} id deleted`);
      // navigate("/");
    } catch (error) {
      console.error(error);
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

  const handleConfirmDelete = () => {
    setConfirmDelete(prev => !prev)
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {auth.accessToken !== undefined ? (
        <div>
          <RidesFilter onFilter={onFilter} />
          {rides.length === 0 ? (
            <div>No rides available.</div>
          ) : (

            <div>
              {rides.map(ride => {
                // Extract the date formatting logic here
                const originalDate = ride.starting_date;
                const formattedDate = formatDate(originalDate);

                const isPastDate = formattedDate < currentDateFormatted;

                const usersInThisRide = userRides.filter(userRide => userRide.ride_id === ride.id);

                // Render the JSX elements, including the formatted date
                return (
                  <div key={`${ride.createdat}-${ride.name}-${ride.distance}`} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
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
                    <div>Created By: {ride.createdby}</div>

                    {userRides.length ?
                      <div>
                        <div>{usersInThisRide.filter(obj => obj.isprivate && obj.ride_id === ride.id).length} joined this ride privately</div>
                        <div>{usersInThisRide.filter(obj => !obj.isprivate && obj.ride_id === ride.id).length} joined this ride publicly:</div>

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
                    {confirmDelete ? (
  rides.length ? (
    <button onClick={() => deactivateRide(ride.id, auth, rides, setRides, setConfirmDelete, isRideCreatedByUser, setRideStatusUpdated)}>Confirm delete</button>
  ) : (
    <button onClick={() => removeFromMyRides(ride.id)}>Confirm remove from my rides</button>
  )
) : (
  rides.length ? (
    <button onClick={handleConfirmDelete}>Delete</button>
  ) : (
    <button onClick={handleConfirmDelete}>Remove from my rides</button>
  )
)}



                    <AddRideMessage userId={userId} userIsLoggedIn={userIsLoggedIn} rideId={ride.id} setMessageSent={setMessageSent} />

                    {ride.messages && (
                      <div>
                        {ride.messages.map(message => (


                          message.status !== 'deleted' && (
                            <div>
                              {message.status === 'flagged' && message.createdby === userId && (
                                <div>
                                  <div>Flagged as inappropiate. Not visible for other users</div>
                                  <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                </div>
                              )}
                              {message.status !== 'flagged' && <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                            </div>
                          )
                        )
                        )}
                      </div>
                    )}



                    {ride.map && ride.map !== null && ride.map !== undefined ? <PreviewMap mapId={ride.map} /> : <div>This ride has no map. The map might have been deleted by the owner.</div>}

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
