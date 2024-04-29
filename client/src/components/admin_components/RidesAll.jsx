//Libraries
import axios from 'axios';

//Hooks
import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";


//Util functions
import { formatDate } from "../util_functions/FormatDate";
import fetchUsernameAndId from '../util_functions/FetchUsername'
import fetchRideMessages from '../util_functions/messaging/FetchRideMessages';
import AddRideMessage from '../util_functions/messaging/AddRideMessage';
import MappedMessage from '../util_functions/messaging/MappedMessage';
import { deactivateRide } from '../util_functions/ride_functions/DeleteRide';
import { deleteRide } from '../util_functions/ride_functions/DeleteRide';


//Components
import PreviewMap from '../PreviewMap';

const RidesAll = () => {
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const userId = user.id;
  const userIsLoggedIn = user.loggedIn;

  const [messageDeleted, setMessageDeleted] = useState(false)
  const [messageFlagged, setMessageFlagged] = useState(false)
  const [messageReported, setMessageReported] = useState(false)

  // console.log("ridesl all", rides)

  useEffect(() => {
    let isMounted = true;

    fetchUsernameAndId(user, setUsers, setIsLoading, setError, isMounted)

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/rides/', {
          params: {
            user: user 
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
  }, [user, messageDeleted, messageReported, messageFlagged]);

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
        {user.loggedIn && user.isAdmin ? (
        <div>
{rides.map(ride => {
  // Extract the date formatting logic here
  const originalDate = ride.starting_date;
  const formattedDate = formatDate(originalDate);



  // Render the JSX elements, including the formatted date
  return (
    
    
<div key={ride.id} style={{ borderBottom: '1px solid black', paddingBottom: '5px' }}>
{!ride.isactive && <div>Inactive ride</div>}
{!ride.isactive &&<button onClick={()=>{deleteRide(ride.id, user, setRides)}}>Definitively delete</button>}
{ride.isactive && <button>Inactivate</button>}


      <div>Name: {ride.name}</div>
      <div>Details: {ride.details}</div>
      <div>Date: {formattedDate}</div> {/* Use formattedDate here */}
      <div>Time: {ride.starting_time}</div>
      <div>Distance: {ride.distance} km</div>
      <div>Speed: {ride.speed} km/h</div>
      <div>Meeting Point: {ride.meeting_point}</div>
      <div>Created By: {ride.createdby}</div>


      {ride.messages && (
                      <div>
                        {ride.messages.map(message => (

                          message.status !== 'deleted' && (
                            <div>
                              {message.status === 'flagged' && (
                                <div>
                                  <div>Flagged as inappropiate. Not visible for other users</div>
                                  <MappedMessage message={message} user={user} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />
                                </div>
                              )}
                              {message.status !== 'flagged' && <MappedMessage message={message} user={user} setMessageDeleted={setMessageDeleted} setMessageReported={setMessageReported} setMessageFlagged={setMessageFlagged} />}
                            </div>
                          )
                        )
                        )}
                      </div>
                    )}



      {ride.map && ride.map !== null && <PreviewMap mapId={ride.map} />}
    </div>
  );
})}


        </div>
            ) : (
              <p>Please log in as an administrator to see rides.</p>
            )}
          </>
      )}
    </div>
  );
};

export default RidesAll;
