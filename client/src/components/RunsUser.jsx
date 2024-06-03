import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';
// import { useAuth } from "./Context/AuthContext";
import useAuth from "../hooks/useAuth"
import RunsFilter from './RunsFilter'

import { faFilter} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../styles/RidesPublic.css'

//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRunMessages from './util_functions/messaging/FetchRunMessages';
import AddRunMessage from './util_functions/messaging/AddRunMessage';
import MappedRunMessage from './util_functions/messaging/MappedRunMessage';
import { deactivateRun } from './util_functions/run_functions/DeleteRun';


const RunsUser = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [runs, setRuns] = useState([]);
  const [showFilter, setShowFilter] = useState(false)
  const [userRuns, setUserRuns] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday
  
  const defaultFilteredRuns = {
    dateStart: yesterday.toISOString(),
    dateEnd: "9999-12-31T00:00:00.000Z",
    distanceMin: 0,
    distanceMax: 100000,
    paceMin: 0,
    paceMax: 100000
  };
  
  const [filteredRuns, setFilteredRuns] = useState(defaultFilteredRuns);



  // const [filteredRuns, setFilteredRuns] = useState();
  const [addToMyRuns, setAddToMyRuns] = useState([])
  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  const [runStatusUpdated, setRunStatusUpdated] = useState(false)

  // console.log("runs", runs)
  // console.log("filtered runs", filteredRuns)

  // const [addToMyRuns, setAddToMyRuns] = useState([])
  const { auth } = useAuth();
  const userIsLoggedIn = auth.loggedIn;
  const id = auth ? auth.userId : null;
  const userId = id
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Run followed by
  const [confirmDelete, setConfirmDelete] = useState(false)
  // const navigate = useNavigate();
  // console.log("confirmDelete", confirmDelete)

  // console.log("runs", runs)

  const isRunCreatedByUser = runs.find(run => run.createdby === auth.userId) !== undefined;
// console.log("isrcbyser", isRunCreatedByUser)
  const onFilter = (filters) => {
    // Here you can apply the filters to your data (e.g., runs) and update the state accordingly
    setFilteredRuns(filters)
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
          const response = await axios.get(`${BACKEND}/runs/user/${id}`, {
            params: {
              user: auth,
              filteredRuns: filteredRuns || ''
            }
          });

          if (isMounted) {
            setRuns(response.data);
            setAddToMyRuns(new Array(response.data.length).fill(false));
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
  }, [id, filteredRuns, messageSent, messageDeleted, messageReported, messageFlagged, runStatusUpdated]);


  useEffect(() => {
    const fetchUserRuns = async () => {
      try {
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
      }
    };

    fetchUserRuns();
  }, [userId
    // , addToMyRuns
  ]);


  const removeFromMyRuns = async (id) => {
    try {
      const userId = auth.userId;
      // const runId = id;
      // console.log("remove from my runs", userId, runId)
      await axios.delete(`${BACKEND}/runs/delete/users/${id}`, {
        data: { userId }
      });
      setRuns(runs.filter(run => run.id !== id));
      // console.log(`Run with ${id} id deleted`);
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
><FontAwesomeIcon icon={faFilter} /></button>}

      {auth.accessToken !== undefined ? (
        <div>
                  {showFilter && 
   <RunsFilter onFilter={onFilter} handleShowFilter={handleShowFilter} />
              }
          {runs.length === 0 ? (
            <div>No runs available.</div>
          ) : (

            <div>
              {runs.map(run => {
                // Extract the date formatting logic here
                const originalDate = run.starting_date;
                const formattedDate = formatDate(originalDate);

                const isPastDate = formattedDate < currentDateFormatted;

                const usersInThisRun = userRuns.filter(userRun => userRun.run_id === run.id);

                // Render the JSX elements, including the formatted date
                return (
                  <div key={`${run.createdat}-${run.name}-${run.distance}`}>
                    <div>Name: {run.name}</div>
                    <div>Details: {run.details}</div>
                    <div>Date: {formattedDate}</div>
                    {isPastDate && (
                      <div>This run has already taken place</div>
                    )}
                    <div>Time: {run.starting_time}</div>
                    <div>Distance: {run.distance} km</div>
                    <div>Speed: {run.speed} km/h</div>
                    <div>Meeting Point: {run.meeting_point}</div>
                    <div>Created By: {run.createdby}</div>

                    {userRuns.length ?
                      <div>
                        <div>{usersInThisRun.filter(obj => obj.isprivate && obj.run_id === run.id).length} joined this run privately</div>
                        <div>{usersInThisRun.filter(obj => !obj.isprivate && obj.run_id === run.id).length} joined this run publicly:</div>

                        <div>
                          {userRuns
                            .filter(userRun => !userRun.isprivate) // Filter out runs where isPrivate is false
                            .filter(userRun => userRun.run_id === run.id) // Filter userRuns for the specific run
                            .map(userRun => {
                              const user = users.find(user => user.id === userRun.user_id);
                              return user ? user.username : ""; // Return username if user found, otherwise an empty string
                            })
                            .join(', ')
                          }


                        </div>
                      </div>
                      :
                      <div>No users have joined this run</div>

                    }

                    {/* {console.log(user.id, run.createdby)} */}
                    {confirmDelete ? (
  isRunCreatedByUser? (
    <button onClick={() => deactivateRun(run.id, auth, runs, setRuns, setConfirmDelete, isRunCreatedByUser, setRunStatusUpdated)}>Confirm delete</button>
  ) : (
    <button onClick={() => removeFromMyRuns(run.id)}>Confirm remove from my runs</button>
  )
) : (
  isRunCreatedByUser? (
    <button onClick={handleConfirmDelete}>Delete</button>
  ) : (
    <button onClick={handleConfirmDelete}>Remove from my runs</button>
  )
)}



                    <AddRunMessage userId={userId} userIsLoggedIn={userIsLoggedIn} runId={run.id} setMessageSent={setMessageSent} />

                    {run.messages && (
                      <div>
                        {run.messages.map(message => (


                          message.status !== 'deleted' && (
                            <div>
                              {message.status === 'flagged' && message.createdby === userId && (
                                <div>
                                  <div>Flagged as inappropiate. Not visible for other users</div>
                                  <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                </div>
                              )}
                              {message.status !== 'flagged' && <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                            </div>
                          )
                        )
                        )}
                      </div>
                    )}



                    {run.map && run.map !== null && run.map !== undefined ? <PreviewMap mapId={run.map} /> : <div>This run has no map. The map might have been deleted by the owner.</div>}

                  </div>
                );
              })}
            </div>

          )}
        </div>
      ) : (
        <p>Please log in to see runs.</p>
      )}
    </div>
  );
};

export default RunsUser;
