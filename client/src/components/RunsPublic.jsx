import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from "./util_functions/FormatDate";
import PreviewMap from './PreviewMap';

import useAuth from "../hooks/useAuth"

import RunsFilter from './RunsFilter';


//Util functions
import fetchUsernameAndId from './util_functions/FetchUsername'
import fetchRunMessages from './util_functions/messaging/FetchRunMessages'
import AddRunMessage from './util_functions/messaging/AddRunMessage'
import MappedRunMessage from './util_functions/messaging/MappedRunMessage';

const RunsPublic = () => {
  const [runs, setRuns] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addToMyRuns, setAddToMyRuns] = useState([])
  const [userRuns, setUserRuns] = useState([]);
  const [users, setUsers] = useState([]); //Fetch usernames and ids to use in Ride followed by
  const [showUsers, setShowUsers] = useState(false)
  const { auth } = useAuth();
  const [filteredRuns, setFilteredRuns] = useState();

  const [messageSent, setMessageSent] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

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

  useEffect( () => {
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
        const response = await axios.get('http://localhost:3500/runs/public', {
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
    // auth, 
    filteredRuns, messageSent, messageDeleted, messageReported, messageFlagged]);

  useEffect(() => {
    const fetchUserRuns = async () => {
      try {
        if (!auth || Object.keys(auth).length === 0) {
          throw new Error("Login to access this area.");
        }
        const response = await axios.get('http://localhost:3500/runs/otherusers', {
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
  }, [userId, addToMyRuns]);


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
      await axios.post(`http://localhost:3500/runs/adduser`, {
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
      await axios.delete(`http://localhost:3500/runs/removeuser`, {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
   <RunsFilter onFilter={onFilter} />
      {runs.length === 0 ? (
        <div>No runs available.</div>
      ) : (
        <>
          {auth.accessToken !== undefined ? (
            <div>

           

              {runs.map((run, index) => {
                  // console.log("Ride ID:", run.id);
                // Extract the date formatting logic here
                const originalDate = run.starting_date;
                // console.log("original date", originalDate)

                const formattedDate = formatDate(originalDate);

                const isPastDate = formattedDate < currentDateFormatted;



                // console.log("isPastDate", isPastDate)


                // Determine if the logged-in user is the creator of this run
                const isUserRun = run.createdby === userId;


                // Determine if the logged-in user is already in this run

// console.log("userRuns", userRuns)
// console.log("run,", run)
                // const isUserInMap = userMaps.some(userMap => userMap.user_id === userId);
                const isUserInRun = userRuns.some(userRun => userRun.user_id === auth.userId && userRun.run_id === run.id);

                const usersInThisRun = userRuns.filter(userRun => userRun.run_id === run.id);


                // console.log("is use in run?", isUserInRide)
                // Render the JSX elements, including the formatted date
                return (
          


                  <div key={`${run.createdat}-${run.createdby}-${run.distance}`} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
                            {/* {console.log("key", run)} */}
                    {/* {console.log("run.id", run.id)} */}
                    <div>Name: {run.name}</div>
                    <div>Details: {run.details}</div>
                    <div>Date: {formattedDate}</div>

                    {isPastDate && (
                      <div>This run has already taken place</div>
                    )}
                    <div>Time: {run.starting_time}</div>
                    <div>Distance: {run.distance} km</div>
                    <div>Pace: {run.pace} min/km</div>
                    <div>Meeting Point: {run.meeting_point}</div>
                    <div>Created By: {
                      users.find(user => user.id === run.createdby)?.username || "Unknown User"
                    }</div>



                    {userRuns.length ?

                      <div>
                        <div>{usersInThisRun.length} joined this run, {usersInThisRun.filter(obj => !obj.isprivate && obj.run_id === run.id).length} publicly</div>

                        {!showUsers && <div onClick={() => setShowUsers(!showUsers)}>+</div>}

                        {showUsers && <div onClick={() => setShowUsers(!showUsers)}>-</div>}

                        {showUsers &&
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
                        }
                      </div>
                      :
                      <div>No users have joined this run</div>

                    }

                    {isUserRun ? (
                      <div></div>
                    ) : isUserInRun ? (


                      <button onClick={(e) => removeFromRun(e, index, run.id)}>Remove from my runs</button>

                    ) : (
                      <div>
                        <button onClick={(e) => addToRun(e, index, run.id, true)}>Join run privately</button>
                        <button onClick={(e) => addToRun(e, index, run.id, false)}>Join run publicly</button>
                      </div>
                    )}

                    {/* {console.log("run messages", run.messages)} */}

                    {(isUserInRun || isUserRun) &&

                      <AddRunMessage userId={userId} userIsLoggedIn={userIsLoggedIn} runId={run.id} setMessageSent={setMessageSent} />
                    }
                    {run.messages && (isUserInRun || isUserRun) && (
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
                                                            {message.status === 'flagged' && message.createdby !== userId && (
                                <div>
                                  <div>Message concealed due to inappropiate content.

                                  <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                  </div>
                  
                                </div>
                              )}
                              {message.status !== 'flagged' && <MappedRunMessage message={message} user={auth} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                            </div>
                          )
                        )
                        )}
                      </div>
                    )}

                    {run.map && run.map !== null ? <PreviewMap mapId={run.map} /> : <div>This run has no map. The map might have been deleted by the owner.</div>}
                  </div>
                );
              })}


            </div>
          ) : (
            <p>Please log in to see runs.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RunsPublic;
