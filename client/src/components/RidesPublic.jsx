import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';

import useAuth from "../hooks/useAuth"

import RidesFilter from './RidesFilter';

import '../styles/RidesPublic.css'

import { faFilter, faMapLocation, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRideMessages from './util_functions/messaging/FetchRideMessages';
import AddRideMessage from './util_functions/messaging/AddRideMessage';
import MappedMessage from './util_functions/messaging/MappedMessage';

const RidesPublic = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [rides, setRides] = useState([]);

  const [showFilter, setShowFilter] = useState(false)
  const [showMap, setShowMap] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [showConversation, setShowConversation] = useState(null)
  const [showUsers, setShowUsers] = useState(null)
  const [showModal, setShowModal] = useState(null)


  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRides, setAddToMyRides] = useState([])
  const [userRides, setUserRides] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by

  const { auth } = useAuth();

  // console.log("auth in RidesPublic", auth)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const defaultFilteredRides = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    speedMin: 0,
    speedMax: 100000
  };

  const [filteredRides, setFilteredRides] = useState(defaultFilteredRides);
  // const [filteredRides, setFilteredRides] = useState()

  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  // console.log("filteredRides", filteredRides)
  const userId = auth.userId;
  //  console.log("auth in Rides Public", auth)
  const userIsLoggedIn = auth.accessToken !== null;



  //Function to get the filters from the child component RidesFilter.
  // FORMAT: {dateRange: {end: "Mar 27 2024, 17:00:00 GMT-0700 (Pacific Daylight Time", start: "Mar 28 2024, 17:00:00 GMT-0700 (Pacific Daylight Time"}, distanceRange: {min: 1, max: 100}, speedRange: {min: 10, max: 30}}


  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., rides) and update the state accordingly
    setFilteredRides(filters)
  };

  useEffect(() => {
    // console.log("filtered Rides", filteredRides)
    //   console.log("Rides", rides)
    //   console.log("users", users)
  }, [rides])

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
        if (!auth || Object.keys(auth).length === 0) {
          throw new Error("Login to access this area.");
        }
        const response = await axios.get(`${BACKEND}/rides/public`, {
          params: {
            user: auth,
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
  }, [
    // auth, 
    filteredRides, messageSent, messageDeleted, messageReported, messageFlagged]);

  useEffect(() => {
    const fetchUserRides = async () => {
      try {
        if (!auth || Object.keys(auth).length === 0) {
          throw new Error("Login to access this area.");
        }
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
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }

    };

    fetchUserRides();
  }, [userId, addToMyRides]);

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }

  const handleShowModal = () => {
    setShowModal(prev => !prev)
  }


  const toggleAddToMyRides = (index) => {
    // console.log("add to my rides before", addToMyRides);
    setAddToMyRides(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      // console.log("add to my rides after", newState); // Log the updated state
      return newState;
    });
  };

  //Function to add user to ride
  const addToRide = async (e, index, rideId, isPrivate) => {
    e.preventDefault();
    try {
      if (!auth || Object.keys(auth).length === 0) {
        throw new Error("Login to access this area.");
      }
      // console.log("Adding to ride...");
      await axios.post(`${BACKEND}/rides/adduser`, {
        userId, userIsLoggedIn, rideId, isPrivate
      });
      // console.log("Successfully added to ride.");
      toggleAddToMyRides(index); // Toggle state for the clicked ride
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };


  //Function to remove user from ride
  const removeFromRide = async (e, index, rideId) => {
    e.preventDefault();
    try {
      if (!auth || Object.keys(auth).length === 0) {
        throw new Error("Login to access this area.");
      }
      // console.log("Adding to map...");
      await axios.delete(`${BACKEND}/rides/removeuser`, {
        data: { userId, userIsLoggedIn, rideId }
      });
      // console.log("Successfully added to map.");
      toggleAddToMyRides(index); // Toggle state for the clicked map
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
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
    <>
      {!showFilter &&
        <button title="Filter" className='rides-public-filter-ride'
          onClick={() => handleShowFilter()}
        > <FontAwesomeIcon icon={faFilter} /></button>}



      <div className='rides-public-container'>



        {showFilter &&
          <RidesFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
        }
        {rides.length === 0 ? (
          <div>No rides available.</div>
        ) : (
          <>
            {auth.accessToken !== undefined ? (
              <div className='rides-public-mapped'>


                {rides.map((ride, index) => {
                  const originalDate = ride.starting_date;
                  const formattedDate = formatDate(originalDate);
                  const isPastDate = formattedDate < currentDateFormatted;
                  const isUserRide = ride.createdby === userId;
                  const isUserInRide = userRides.some(userRide => userRide.user_id === auth.userId && userRide.ride_id === ride.id);
                  const usersInThisRide = userRides.filter(userRide => userRide.ride_id === ride.id);

                  return (

                    <>
                      {/* 
                      {showModal && <div className='modal-container'>
                        <button onClick={handleShowModal}>x</button>
                        <div className='modal-content'>Modal content</div>
                      </div>} */}

                      <div
                        className='rides-public-ride'
                        key={`${ride.createdat}-${ride.createdby}-${ride.distance}`}>


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



                        {!showDetails && (
                          <div className='rides-public-ride-top-buttons'>




                            {/* <button className='orange-button' onClick={() => setShowDetails(prev => prev === ride.id ? null : ride.id)}>{showDetails === ride.id ?
                              <FontAwesomeIcon icon={faCaretUp} /> :
                              <FontAwesomeIcon icon={faCaretDown} />}</button> */}

                            {/* <button onClick={handleShowModal} className='orange-button'>+</button> */}

                          </div>)}




                        {showDetails === ride.id && <>
                          <div>Details: {ride.details}</div>
                          <div>Meeting Point: {ride.meeting_point}</div>
                          <div>Created By: {
                            users.find(user => user.id === ride.createdby)?.username || "Unknown User"
                          }</div>

                          {isUserRide ? (
                            <div></div>
                          ) : isUserInRide ? (


                            <div className='rides-public-remove-button'>
                              <button className="red-button small-button" onClick={(e) => removeFromRide(e, index, ride.id)}>Remove from my rides</button>
                              
                              {/* <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === ride.id ? null : ride.id)}>{showUsers === ride.id ? 'Hide users' : 'Show users'}</button> */}
                              <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === ride.id ? null : ride.id)}>
  {showUsers && showUsers === ride.id ? (
    'Hide users'
  ) : (
    'Show users'
  )}
</button>

                              
                              
                              <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === ride.id ? null : ride.id)}>{showConversation === ride.id ? 'Hide conversation' : 'Show conversation'}</button>
                            </div>

                          ) : (
                            <div className='rides-public-join-buttons'>
                              <button className='orange-button small-button' onClick={(e) => addToRide(e, index, ride.id, true)}>Join privately</button>
                              <button className='orange-button small-button' onClick={(e) => addToRide(e, index, ride.id, false)}>Join publicly</button>
                              {/* <button className='orange-button small-button' onClick={() => setShowUsers(!showUsers)}>{showUsers ? 'Hide users' : 'Show users'}</button> */}
                              <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === ride.id ? null : ride.id)}>
  {showUsers && showUsers === ride.id ? (
    'Hide users'
  ) : (
    'Show users'
  )}
</button>

                            </div>
                          )}

                          {showUsers === ride.id && (

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
                          )
                          }


                          {showConversation === ride.id && (
                            <div className='ride-conversation-container'>


                              {
                                (isUserInRide || isUserRide) &&

                                <AddRideMessage userId={userId} userIsLoggedIn={userIsLoggedIn} rideId={ride.id} setMessageSent={setMessageSent} />
                              }
                              {ride.messages && (isUserInRide || isUserRide) && (
                                <div>
                                  {ride.messages.map(message => (


                                    message.status !== 'deleted' && (
                                      <div>
                                        {message.status === 'flagged' && message.createdby === userId && (
                                          <div>
                                            {/* <div className='flagged-inappropiate-message'>Flagged as inappropiate. Not visible for other users</div> */}
                                            <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                          </div>
                                        )}
                                        {message.status === 'flagged' && message.createdby !== userId && (
                                          <div>
                                            <div className='flagged-inappropiate-message'>
                                              {/* Message concealed due to inappropiate content. */}

                                              <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                            </div>

                                          </div>
                                        )}
                                        {message.status !== 'flagged' && <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                                      </div>
                                    )
                                  )
                                  )}
                                </div>
                              )}

                            </div>)
                          }




                        </>}



                        {showMap === ride.id && <>
                          {ride.map && ride.map !== null ? <PreviewMap mapId={ride.map} /> : <div>This ride has no map. The map might have been deleted by the owner.</div>}
                        </>
                        }

                      </div>
                    </>
                  );
                })}


              </div>
            ) : (
              <p>Please log in to see rides.</p>
            )}
          </>

        )}

      </div>
    </>

  );
};

export default RidesPublic;
