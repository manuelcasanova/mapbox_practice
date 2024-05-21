//Libraries
import axios from 'axios';

//Hooks
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';


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

const RunsAll = () => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const [runs, setRuns] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  const userId = auth.userId
  const userIsLoggedIn = auth.loggedIn;

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  const [runStatusUpdated, setRunStatusUpdated] = useState(false)

  const isRunCreatedByUser = runs.find(run => run.createdby === auth.userId) !== undefined;

  // console.log("runsl all", runs)

  useEffect(() => {
    let isMounted = true;

    fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted)

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/runs/`, {
          params: {
            user: auth 
          }
        });
        if (isMounted) {
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
    messageDeleted, messageReported, messageFlagged, runStatusUpdated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {runs.length === 0 ? (
        <div>No runs available.</div>
      ) : (
        <>
        {auth.accessToken !== undefined && auth.isAdmin ? (
        <div>
{runs.map(run => {
  // Extract the date formatting logic here
  const originalDate = run.starting_date;
  const formattedDate = formatDate(originalDate);



  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={`${run.id}-${run.name}-${run.distance}`} >
{!run.isactive && <div>Inactive run</div>}
{!run.isactive &&<button onClick={()=>{deleteRun(run.id, auth, setRuns)}}>Definitively delete</button>}
{run.isactive && <button onClick={()=>{deactivateRun(run.id, auth, runs, setRuns, setConfirmDelete, isRunCreatedByUser, setRunStatusUpdated)}}>Inactivate</button>}


      <div>Name: {run.name}</div>
      <div>Details: {run.details}</div>
      <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
      <div>Time: {run.starting_time}</div>
      <div>Distance: {run.distance} km</div>
      <div>Speed: {run.speed} km/h</div>
      <div>Meeting Point: {run.meeting_point}</div>
      <div>Created By: {run.createdby}</div>


      {run.messages && (
                      <div>
                        {run.messages.map(message => (

                          message.status !== 'deleted' && (
                            <div>
                              {message.status === 'flagged' && (
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



      {run.map && run.map !== null && <PreviewMap mapId={run.map} />}
    </div>
  );
})}


        </div>
            ) : (
              <p>Please log in as an administrator to see runs.</p>
            )}
          </>
      )}
    </>
  );
};

export default RunsAll;
