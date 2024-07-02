import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';

import useAuth from "../hooks/useAuth"

import RunsFilter from './RunsFilter';

import '../styles/RidesPublic.css'

import { faSliders, faMapLocation, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRunMessages from './util_functions/messaging/FetchRunMessages'
import AddRunMessage from './util_functions/messaging/AddRunMessage'
import MappedRunMessage from './util_functions/messaging/MappedRunMessage';

const RunsPublic = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [runs, setRuns] = useState([]);

  const [showFilter, setShowFilter] = useState(false)
  const [showMap, setShowMap] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [showConversation, setShowConversation] = useState(null)
  const [showUsers, setShowUsers] = useState(null)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRuns, setAddToMyRuns] = useState([])
  const [userRuns, setUserRuns] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by

  const { auth } = useAuth();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const defaultFilteredRuns = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    paceMin: 0,
    paceMax: 100000,
    runName: 'all'
    
  };

  const [filteredRuns, setFilteredRuns] = useState(defaultFilteredRuns);

  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  const [reloadMessages, setReloadMessages] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

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

  //  console.log("filteredRuns", filteredRuns)
  const userId = auth.userId;
  // console.log("auth in Rides Public", auth)
  const userIsLoggedIn = auth.accessToken !== null;


  //Function to get the filters from the child component RunsFilter.
  // FORMAT: {dateRange: {end: "Mar 27 2024, 17:00:00 GMT-0700 (Pacific Daylight Time", start: "Mar 28 2024, 17:00:00 GMT-0700 (Pacific Daylight Time"}, distanceRange: {min: 1, max: 100}, speedRange: {min: 10, max: 30}}


  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., runs) and update the state accordingly
    setFilteredRuns(filters)
  };

  useEffect(() => {
    // console.log("filtered Runs", filteredRuns)
    //   console.log("Runs", runs)
    //   console.log("users", users)
  }, [runs])

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
        const response = await axios.get(`${BACKEND}/runs/public`, {
          params: {
            user: auth,
            filteredRuns
          }
        });

        if (isMounted) {

          // Initialize addToMyMaps state with false for each map
          setAddToMyRuns(new Array(response.data.length).fill(false));

          setRuns(response.data);
          setIsLoading(false);


          // Fetch messages for each run
          const runMessagesPromises = response.data.map(run => fetchRunMessages(run.id));
          const runMessages = await Promise.all(runMessagesPromises);
          setRuns(prevRuns => {
            return prevRuns.map((run, index) => {
              return { ...run, messages: runMessages[index] };
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
    auth,
    filteredRuns, messageSent, messageDeleted, messageReported, messageFlagged, reloadMessages, BACKEND]);

  useEffect(() => {
    const fetchUserRuns = async () => {
      try {
        if (!auth || Object.keys(auth).length === 0) {
          throw new Error("Login to access this area.");
        }
        const response = await axios.get(`${BACKEND}/runs/otherusers`, {
          params: {
            userId
          }
        });
        // Check if the response data is not an empty array before updating the state
        if (Array.isArray(response.data) && response.data.length > 0) {
          setUserRuns(response.data);
        } else {
          setUserRuns([])
        }
      } catch (error) {
        console.error('Error fetching user runs:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }

    };

    fetchUserRuns();
  }, [userId, addToMyRuns, auth, BACKEND]);

  const handleShowFilter = () => {
    setShowFilter(prev => !prev)
  }

  const handleReloadMessages = () => {
    setReloadMessages(prev => !prev)
  }

  const handleShowInfo = () => {
    setShowInfo(prev => !prev)
  }


  const toggleAddToMyRuns = (index) => {
    // console.log("add to my runs before", addToMyRuns);
    setAddToMyRuns(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      // console.log("add to my runs after", newState); // Log the updated state
      return newState;
    });
  };

  //Function to add user to run
  const addToRun = async (e, index, runId, isPrivate) => {
    e.preventDefault();
    try {
      if (!auth || Object.keys(auth).length === 0) {
        throw new Error("Login to access this area.");
      }
      // console.log("Adding to run...");
      await axios.post(`${BACKEND}/runs/adduser`, {
        userId, userIsLoggedIn, runId, isPrivate
      });
      // console.log("Successfully added to run.");
      toggleAddToMyRuns(index); // Toggle state for the clicked run
      setError(null)
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later or contact the administrator.");
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };


  //Function to remove user from run
  const removeFromRun = async (e, index, runId) => {
    e.preventDefault();
    try {
      if (!auth || Object.keys(auth).length === 0) {
        throw new Error("Login to access this area.");
      }
      // console.log("Adding to map...");
      await axios.delete(`${BACKEND}/runs/removeuser`, {
        data: { userId, userIsLoggedIn, runId }
      });
      // console.log("Successfully added to map.");
      toggleAddToMyRuns(index); // Toggle state for the clicked map
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
    return <div className="loading"></div>;
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
      {showFilter &&
        <RunsFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
      }
      {runs.length === 0 ? (
        <div>No runs available.</div>
      ) : (
        <>
          {auth.accessToken !== undefined ? (
            <div className='rides-public-mapped'>

              {runs.map((run, index) => {
                // console.log("Ride ID:", run.id);
                // Extract the date formatting logic here
                const originalDate = run.starting_date;
                // console.log("original date", originalDate)

                const formattedDate = formatDate(originalDate);

                const isPastDate = formattedDate < currentDateFormatted;

                const isUserRun = run.createdby === userId;
                const isUserInRun = userRuns.some(userRun => userRun.user_id === auth.userId && userRun.run_id === run.id);
                const usersInThisRun = userRuns.filter(userRun => userRun.run_id === run.id);


                // console.log("is use in run?", isUserInRun)
                // Render the JSX elements, including the formatted date
                return (



                  <div
                    className='rides-public-ride'
                    key={run.id}>
                    {/* {console.log("key", run)} */}
                    {/* {console.log("run.id", run.id)} */}


                    <div className='rides-public-ride-top-buttons'>

                      <button className='orange-button' onClick={() => setShowDetails(prev => prev === run.id ? null : run.id)}>{showDetails === run.id ?
                        <FontAwesomeIcon icon={faCaretUp} /> :
                        <FontAwesomeIcon icon={faCaretDown} />}</button>

                      <button className='orange-button' onClick={() => setShowMap(prev => prev === run.id ? null : run.id)}>
                        {showMap && showMap === run.id ? (
                          <div className='map-crossed-out'>
                            <FontAwesomeIcon icon={faMapLocation} />
                            <div className='cross-map'></div>
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faMapLocation} />
                        )}
                      </button>

                    </div>


                    <div className="rides-public-ride-name">Name: {run.name}</div>
                    <div>Date: {formattedDate}</div>
                    {isPastDate && (
                      <div>This run has already taken place</div>
                    )}
                    <div>Time: {run.starting_time}</div>
                    <div>Distance: {run.distance} km</div>
                    <div>Pace: {run.pace} min/km</div>


                    {showDetails === run.id && <>
                      <div>Details: {run.details}</div>
                      <div>Meeting Point: {run.meeting_point}</div>
                      <div>Created By: {
                        users.find(user => user.id === run.createdby)?.username || "Unknown User"
                      }</div>

                      {isUserRun ? (
                        <div>

                          <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === run.id ? null : run.id)}>{showConversation === run.id ? 'Hide conversation' : 'Show conversation'}</button>

                          <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === run.id ? null : run.id)}>
                            {showUsers && showUsers === run.id ? (
                              'Hide users'
                            ) : (
                              'Show users'
                            )}
                          </button>

                        </div>
                      ) : isUserInRun ? (

                        <div className='rides-public-remove-button'>
                          <button className="red-button small-button" onClick={(e) => removeFromRun(e, index, run.id)}>Remove from my runs</button>

                          <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === run.id ? null : run.id)}>
                            {showUsers && showUsers === run.id ? (
                              'Hide users'
                            ) : (
                              'Show users'
                            )}
                          </button>

                          <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === run.id ? null : run.id)}>{showConversation === run.id ? 'Hide conversation' : 'Show conversation'}</button>
                        </div>

                      ) : (
                        <div className='rides-public-join-buttons'>
                          <button className='orange-button small-button' onClick={(e) => addToRun(e, index, run.id, true)}>Join privately</button>
                          <button className='orange-button small-button' onClick={(e) => addToRun(e, index, run.id, false)}>Join publicly</button>
                          {/* <button className='orange-button small-button' onClick={() => setShowUsers(!showUsers)}>{showUsers ? 'Hide users' : 'Show users'}</button> */}
                          <button className='orange-button small-button' onClick={() => setShowUsers(prev => prev === run.id ? null : run.id)}>
                            {showUsers && showUsers === run.id ? (
                              'Hide users'
                            ) : (
                              'Show users'
                            )}
                          </button>

                        </div>
                      )}


                      {showUsers === run.id && (

                        userRuns.length ?

                          <>
                            <div className='rides-public-joined-information'>
                              <div>{usersInThisRun.length} joined this run</div>


                              <div className='rides-public-joined-users-list'>
                                {usersInThisRun.filter(obj => !obj.isprivate && obj.run_id === run.id).length} of them publicly:
                                <span> </span>
                                {userRuns
                                  .filter(userRun => !userRun.isprivate) // Filter out rides where isPrivate is false
                                  .filter(userRun => userRun.run_id === run.id) // Filter userRides for the specific ride
                                  .map(userRun => {
                                    const user = users.find(user => user.id === userRun.user_id);
                                    return user ? user.username : ""; // Return username if user found, otherwise an empty string
                                  })
                                  .join(', ')
                                }
                              </div>
                            </div>
                          </>
                          :
                          <div>No users have joined this run</div>
                      )
                      }


                      {showConversation === run.id && (
                        <div className='ride-conversation-container'>

                          {(isUserInRun || isUserRun) &&

                            <AddRunMessage userId={userId} userIsLoggedIn={userIsLoggedIn} runId={run.id} setMessageSent={setMessageSent} />
                          }


<div className='refresh-messages-and-info'>
                                <button 
                                className='orange-button button-small'
                                onClick={handleReloadMessages}
                                >Update messages</button>
                                <button
                                className='info-button'
                                onClick={handleShowInfo}
                                >i</button>
                                </div>

{showInfo && (
  <div className='info-message'>Our team of developers is working on a feature to update messages automatically when any user writes them. In the mean time, please use this button.</div>
)}


                          {run.messages && (isUserInRun || isUserRun) && (
                            <div>
                              {run.messages.map(message => (

<React.Fragment key={message.id}>


{
                                        message.status === 'deleted' &&
                                          <div
                                          key={`${message.createdat}-${message.createdby}`}
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


                               { message.status !== 'deleted' && (
                                  <div>


                                    {message.status === 'flagged' && message.createdby === userId && (
                                      <div>
                                        {/* <div>Flagged as inappropiate. Not visible for other users</div> */}
                                        <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                      </div>
                                    )}



                                    {message.status === 'flagged' && message.createdby !== userId && (
                                      <div>
                                        <div>Message concealed due to inappropiate content.

                                          <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                        </div>

                                      </div>
                                    )}
                                    {message.status !== 'flagged' && <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                                  </div>
                                )}



</React.Fragment>



                              )
                              )}




                            </div>




                          )}

                        </div>)
                      }

                    </>}

                    {showMap === run.id && <>
                      {run.map && run.map !== null ? <PreviewMap mapId={run.map} /> : <div>This run has no map. The map might have been deleted by the owner.</div>}

                    </>
                    }

                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see runs.</p>
          )}
        </>
      )}
    </>
  );
};

export default RunsPublic;
