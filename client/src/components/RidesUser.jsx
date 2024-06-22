import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
import useAuth from "../hooks/useAuth"
import RidesFilter from './RidesFilter';

import '../styles/RidesPublic.css'

import { faSliders, faMapLocation, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRideMessages from './util_functions/messaging/FetchRideMessages';
import AddRideMessage from './util_functions/messaging/AddRideMessage';
import MappedMessage from './util_functions/messaging/MappedMessage';
import { deactivateRide } from './util_functions/ride_functions/DeleteRide';
import { removeFromMyRides } from './util_functions/ride_functions/DeleteRide';


const RidesUser = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [rides, setRides] = useState([]);
  const [showFilter, setShowFilter] = useState(null)
  const [showMap, setShowMap] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [showConversation, setShowConversation] = useState(null)
  const [showUsers, setShowUsers] = useState(false)
  const [userRides, setUserRides] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const defaultFilteredRides = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    speedMin: 0,
    speedMax: 100000,
    rideName: 'all'
  };

  const [filteredRides, setFilteredRides] = useState(defaultFilteredRides);

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
          const response = await axios.get(`${BACKEND}/rides/user/${id}`, {
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
        const response = await axios.get(`${BACKEND}/rides/otherusers`, {
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
      await axios.delete(`${BACKEND}/rides/delete/users/${id}`, {
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

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }

  const handleShowDetails = () => {
    setShowDetails(prev => !prev)
  }

  const handleShowMap = () => {
    setShowMap(prev => !prev)
  }



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='rides-public-container'>

      {!showFilter &&
        <button className='rides-public-filter-ride'
          onClick={() => handleShowFilter()}
        ><FontAwesomeIcon icon={faSliders} /></button>}

      {auth.accessToken !== undefined ? (
        <div>
          {showFilter &&
            <RidesFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
          }
          {rides.length === 0 ? (
            <div>No rides available.</div>
          ) : (

            <div>
              {rides.map(ride => {
                // Extract the date formatting logic here
                const originalDate = ride.starting_date;
                const formattedDate = formatDate(originalDate);
                const isRideCreatedByUser = ride.createdby === userId;
                const isPastDate = formattedDate < currentDateFormatted;


                const formattedMessageDate = (createdAt) => {
                  const date = new Date(createdAt);

                  // Options for the date part
                  const dateOptions = {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  };

                  // Options for the time part
                  const timeOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  };

                  // Format date and time separately
                  const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
                  const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);

                  // Return the desired output format
                  return `${formattedDate} at ${formattedTime}`;
                };




                const usersInThisRide = userRides.filter(userRide => userRide.ride_id === ride.id);

                // Render the JSX elements, including the formatted date
                return (
                  <div
                    className='rides-public-ride'
                    key={`${ride.createdat}-${ride.name}-${ride.distance}`}>



                    <div className='rides-public-ride-top-buttons'>

                      <button className='orange-button' onClick={() => setShowDetails(prev => prev === ride.id ? null : ride.id)}>{showDetails === ride.id ?
                        <FontAwesomeIcon icon={faCaretUp} /> :
                        <FontAwesomeIcon icon={faCaretDown} />}</button>

                      <button className='orange-button' onClick={() => setShowMap(prev => prev === ride.id ? null : ride.id)}>
                        {showMap && showMap === ride.id ? (
                          <div className='map-crossed-out'>
                            <FontAwesomeIcon icon={faMapLocation} />
                            <div className='cross-map'></div>
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faMapLocation} />
                        )}
                      </button>



                    </div>






                    <div className="rides-public-ride-name">Name: {ride.name}</div>

                    <div>Date: {formattedDate}</div>
                    {isPastDate && (
                      <div>This ride has already taken place</div>
                    )}
                    <div>Time: {ride.starting_time}</div>
                    <div>Distance: {ride.distance} km</div>
                    <div>Speed: {ride.speed} km/h</div>


                    {/* {!showDetails && (
                      <div className='rides-public-ride-top-buttons'>
                        <button className='orange-button' onClick={handleShowMap}>{showMap ?
                          <div className='map-crossed-out'>
                            <FontAwesomeIcon icon={faMapLocation} />
                            <div className='cross-map'></div>
                          </div>

                          :
                          <FontAwesomeIcon icon={faMapLocation} />
                        }</button>


                      </div>)} */}

                    {showDetails === ride.id && <>

                      <div>Details: {ride.details}</div>
                      <div>Meeting Point: {ride.meeting_point}</div>
                      <div>Created By: {
                        users.find(user => user.id === ride.createdby)?.username || "Unknown User"
                      }</div>

                      <div className='rides-public-remove-button'>

                        <button className='orange-button small-button' onClick={() => setShowUsers(!showUsers)}> {showUsers ? 'Hide users' : 'Show users'}</button>
                        <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === ride.id ? null : ride.id)}>{showConversation === ride.id ? 'Hide conversation' : 'Show conversation'}</button>

                        {confirmDelete ? (
                          isRideCreatedByUser ? (
                            <>
                              <button className="red-button small-button" onClick={() => deactivateRide(ride.id, auth, rides, setRides, setConfirmDelete, isRideCreatedByUser, setRideStatusUpdated)}>Confirm delete</button>
                              <button className="red-button button-close small-button" onClick={handleConfirmDelete}>x</button>
                            </>
                          ) : (
                            <>
                              <button className="red-button small-button" onClick={() => removeFromMyRides(ride.id)}>Confirm remove from my rides</button>
                              <button className="red-button button-close small-button" onClick={handleConfirmDelete}>x</button>
                            </>
                          )
                        ) : (
                          isRideCreatedByUser ? (
                            <button className="red-button small-button" onClick={handleConfirmDelete}>Delete</button>
                          ) : (
                            <button className="red-button small-button" onClick={handleConfirmDelete}>Remove from my rides</button>
                          )
                        )}

                      </div>

                      {showUsers && (
                        userRides.length ?
                          <>
                            <div className='rides-public-joined-information'>

                              <div>{usersInThisRide.length} joined this ride</div>


                              <div className='rides-public-joined-users-list'>
                                {usersInThisRide.filter(obj => !obj.isprivate && obj.ride_id === ride.id).length} of them publicly:
                                <span> </span>


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



                          </>
                          :
                          <div>No users have joined this ride</div>
                      )}

                    </>}








                    {showConversation === ride.id && (

                      <>
                        <AddRideMessage userId={userId} userIsLoggedIn={userIsLoggedIn} rideId={ride.id} setMessageSent={setMessageSent} />

                        {ride.messages && (
                          <div>
                            {ride.messages.map(message =>
                            (
                              <>
                                {message.status === 'deleted' &&
                                  <div
                                    key={message.id}
                                    className={`mapped-messages-container deleted-message-margin ${users.find(user => userId === message.createdby)
                                      ? 'my-comment'
                                      : 'their-comment'
                                      }`}
                                  >
                                    <div className="mapped-messages-name-and-message">

                                      <div className="mapped-messages-username deleted-message">

                                        {users.find(user => user.id === message.createdby)?.username || "Unknown User"}
                                      </div>
                                      <div className='deleted-message'>Deleted message</div>

                                    </div>
                                    <div className="mapped-messages-date deleted-message">{formattedMessageDate(message.createdat)}</div>

                                  </div>
                                }

                                {message.status !== 'deleted' && (
                                  <div>
                                    {message.status === 'flagged' && message.createdby === userId && (
                                      <div>
                                        {/* <div>Flagged as inappropiate. Not visible for other users</div> */}
                                        <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                      </div>
                                    )}
                                    {message.status !== 'flagged' && <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}

                                  </div>


                                )}
                              </>
                            )
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {showMap === ride.id && <>

                      {ride.map && ride.map !== null && ride.map !== undefined ? <PreviewMap mapId={ride.map} /> : <div>This ride has no map. The map might have been deleted by the owner.</div>}
                    </>
                    }
                  </div>
                );
              })}
            </div>

          )}
        </div>
      ) : (
        <p>Please log in to see rides.</p>
      )}
    </div>
  );
};

export default RidesUser;
