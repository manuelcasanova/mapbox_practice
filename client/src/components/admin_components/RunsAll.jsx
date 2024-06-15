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
import fetchRunMessages from '../util_functions/messaging/FetchRunMessages';
import AddRunMessage from '../util_functions/messaging/AddRunMessage';
import MappedRunMessage from '../util_functions/messaging/MappedRunMessage';
import { deactivateRun } from '../util_functions/run_functions/DeleteRun';
import { deleteRun } from '../util_functions/run_functions/DeleteRun';


//Components
import PreviewMap from '../PreviewMap';
import RunsFilter from '../../components/RunsFilter'

const RunsAll = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [runs, setRuns] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  const [showFilter, setShowFilter] = useState(false)
  const [showMap, setShowMap] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [showConversation, setShowConversation] = useState(null)
  const [showUsers, setShowUsers] = useState(null)
  const [runsAllComponentMount, setRunsAllComponentMount] = useState(false)
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

  const [runStatusUpdated, setRunStatusUpdated] = useState(false)

  const isRunCreatedByUser = runs.find(run => run.createdby === auth.userId) !== undefined;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const defaultFilteredRuns = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    speedMin: 0,
    speedMax: 100000,
    runName: 'all',
    rId: 0
  };

  const [filteredRuns, setFilteredRuns] = useState(defaultFilteredRuns);

  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., rides) and update the state accordingly
    setFilteredRuns(filters)
  };
  // console.log("ridesl all", rides)

  useEffect(() => {
    let isMounted = true;

    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/runs/`, {
          params: {
            user: auth,
            filteredRuns
          }
        });
        if (isMounted) {
          setRuns(response.data);
          setIsLoading(false);
setRunsAllComponentMount(true)
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
    // auth, 
    filteredRuns, messageDeleted, messageReported, messageFlagged, runStatusUpdated]);

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
          <RunsFilter onFilter={onFilter} handleShowFilter={handleShowFilter} runsAllComponentMount={runsAllComponentMount}  />
        }






        {runs.length === 0 ? (
          <div>No runs available.</div>
        ) : (
          <>
            {auth.accessToken !== undefined && auth.isAdmin ? (
              <div className='rides-public-mapped'>
                {runs.map(run => {
                  // Extract the date formatting logic here
                  const originalDate = run.starting_date;
                  const formattedDate = formatDate(originalDate);



                  // Render the JSX elements, including the formatted date
                  return (

                    <>
                      <div className='rides-public-ride' key={`${run.id}-${run.name}-${run.distance}`} >

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
                        <div className='inactive-buttons'>
                          {!run.isactive && <div className='inactive-r'>Inactive run</div>}
                          {!run.isactive && <button className='red-button small-button' onClick={() => { deleteRun(run.id, auth, setRuns) }}>Definitively delete</button>}
                          {run.isactive && <button className="red-button small-button" onClick={() => { deactivateRun(run.id, auth, runs, setRuns, setConfirmDelete, isRunCreatedByUser, setRunStatusUpdated) }}>Inactivate</button>}
                        </div>

                        <div>Name: {run.name}</div>
                        <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
                        <div>Time: {run.starting_time}</div>
                        <div>Distance: {run.distance} km</div>
                        <div>Pace: {run.pace} km/h</div>


                        {showDetails === run.id &&
                          <>

                            <div>Details: {run.details}</div>
                            <div>Meeting Point: {run.meeting_point}</div>
                            <div>Created By: {
                              users.find(user => user.id === run.createdby)?.username || "Unknown User"
                            }</div>


                            <div className='rides-public-remove-button'>
                              <button className='orange-button small-button' onClick={() => setShowConversation(prev => prev === run.id ? null : run.id)}>{showConversation === run.id ? 'Hide conversation' : 'Show conversation'}</button>
                            </div>


                            {showConversation === run.id && run.messages && (
                              <div>
                                {run.messages.map(message => (

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
                                              <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                            </div>
                                          )}
                                          {message.status !== 'flagged' && <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                                        </div>
                                      )
                                    }


                                  </>



                                )
                                )}
                              </div>
                            )}


                            {showMap === run.id &&
                              <>
                                {run.map && run.map !== null && <PreviewMap mapId={run.map} />}
                              </>
                            }



                          </>
                        }
                      </div>
                    </>
                  );
                })}


              </div>
            ) : (
              <p>Please log in as an administrator to see runs.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RunsAll;
