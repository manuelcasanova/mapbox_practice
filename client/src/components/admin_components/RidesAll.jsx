//Libraries
import axios from 'axios';

//Hooks
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';


import { faSliders, faMapLocation, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



//Util functions
import { formatDate } from "../util_functions/FormatDate";
import fetchUsernameAndId from '../util_functions/FetchUsername'
import fetchRideMessages from '../util_functions/messaging/FetchRideMessages';
import AddRideMessage from '../util_functions/messaging/AddRideMessage';
import MappedMessage from '../util_functions/messaging/MappedMessage';
import { deactivateRide } from '../util_functions/ride_functions/DeleteRide';
import { deleteRide } from '../util_functions/ride_functions/DeleteRide';
import RidesFilter from '../../components/RidesFilter'


//Components
import PreviewMap from '../PreviewMap';

const RidesAll = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  const [showFilter, setShowFilter] = useState(false)
  const [showMap, setShowMap] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [showConversation, setShowConversation] = useState(null)
  const [showUsers, setShowUsers] = useState(null)

  const userId = auth.userId
  const userIsLoggedIn = auth.loggedIn;

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

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  const [rideStatusUpdated, setRideStatusUpdated] = useState(false)

  const isRideCreatedByUser = rides.find(ride => ride.createdby === auth.userId) !== undefined;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const defaultFilteredRides = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    speedMin: 0,
    speedMax: 100000,
    rideName: ''
  };

  const [filteredRides, setFilteredRides] = useState(defaultFilteredRides);

  // console.log("filtered Rides in Rides All", filteredRides)

  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., rides) and update the state accordingly
    setFilteredRides(filters)
  };
  // console.log("ridesl all", rides)

  useEffect(() => {
    let isMounted = true;

    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/rides/`, {
          params: {
            user: auth,
            filteredRides
          }
        });
        if (isMounted) {
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
    filteredRides, messageDeleted, messageReported, messageFlagged, rideStatusUpdated]);


  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }

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
        > <FontAwesomeIcon icon={faSliders} /></button>}

      <div className='rides-public-container'>

        {showFilter &&
          <RidesFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
        }

        {rides.length === 0 ? (
          <div>No rides available.</div>
        ) : (
          <>
            {auth.accessToken !== undefined && auth.isAdmin ? (
              <div className='rides-public-mapped'>
                {rides.map(ride => {
                  // Extract the date formatting logic here
                  const originalDate = ride.starting_date;
                  const formattedDate = formatDate(originalDate);



                  // Render the JSX elements, including the formatted date
                  return (
                    <>

                      <div className='rides-public-ride' key={`${ride.id}-${ride.name}-${ride.distance}`} >



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

                        <div className='inactive-buttons'>
                          {!ride.isactive && <div className='inactive-r'>Inactive ride</div>}
                          {!ride.isactive && <button className='red-button small-button' onClick={() => { deleteRide(ride.id, auth, setRides) }}>Definitively delete</button>}
                          {ride.isactive && <button className="red-button small-button" onClick={() => { deactivateRide(ride.id, auth, rides, setRides, setConfirmDelete, isRideCreatedByUser, setRideStatusUpdated) }}>Inactivate</button>}
                        </div>
                        <div >Name: {ride.name}</div>

                        <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
                        <div>Time: {ride.starting_time}</div>
                        <div>Distance: {ride.distance} km</div>
                        <div>Speed: {ride.speed} km/h</div>


                        {showDetails === ride.id &&
                          <>
                            <div>Details: {ride.details}</div>
                            <div>Meeting Point: {ride.meeting_point}</div>
                            <div>Created By: {
                              users.find(user => user.id === ride.createdby)?.username || "Unknown User"
                            }</div>

                            <div className='rides-public-remove-button'>
                              <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === ride.id ? null : ride.id)}>{showConversation === ride.id ? 'Hide conversation' : 'Show conversation'}</button>
                            </div>

                            {showConversation === ride.id && ride.messages && (
                              <div>
                                {ride.messages.map(message => (
                                  <>

                                    {
                                      message.status === 'deleted' &&
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
                                          <div className='deleted-message'>Deleted message. Visible for admin.</div>
                                          <div>{`${message.message}`}</div>

                                        </div>
                                        <div className="mapped-messages-date deleted-message">{formattedMessageDate(message.createdat)}</div>

                                      </div>
                                    }


                                    {
                                      message.status !== 'deleted' && (
                                        <div>


                                          {message.status === 'flagged' && (
                                            <div>
                                              {/* <div>Flagged as inappropiate. Not visible for other users</div> */}
                                              <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                            </div>
                                          )}


                                          {message.status !== 'flagged' && <MappedMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                                        </div>
                                      )
                                    }
                                  </>
                                )





                                )}
                              </div>
                            )}




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
              <p>Please log in as an administrator to see rides.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RidesAll;
