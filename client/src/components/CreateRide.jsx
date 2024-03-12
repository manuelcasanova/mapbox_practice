import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PreviewMap from "./PreviewMap";
import CalendarComponent from "./CalendarComponent"
import TimePickerComponent from "./TimePickerComponent";
import { useAuth } from "./Context/AuthContext";

export default function CreateRide() {

  const { user, mapId, setMapId } = useAuth();
  const userId = user.id;

  const [privateRide, setPrivateRide] = useState(true);
  const [publicRide, setPublicRide] = useState(false);

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [distance, setDistance] = useState('');
  const [speed, setSpeed] = useState('');
  const [date, setDate] = useState(new Date());
  const dateString = date.toLocaleDateString("en-GB")

  const [time, setTime] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [details, setDetails] = useState('');

  const [maps, setMaps] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const createdAt = new Date().toISOString();

  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = () => {
    setPrivateRide(!privateRide);
    setPublicRide(!publicRide);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', {
          params: { userId },
          signal: controller.signal

        });
        if (isMounted) {
          setMaps(response.data);
          if (response.data.length > 0) {
            setMapId(response.data[0].id);
          }

          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error(error);
        }
      }
    };

    getMaps();

    return () => {
      controller.abort();
    };
  }, [userId, setMapId]);

  useEffect(() => {
    // console.log("isLoading:", isLoading);
  }, [isLoading]);


  const handleDateInputClick = () => {
    if (!showCalendar) { // Toggle showCalendar only if it's not already shown
      setShowCalendar(true);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setShowCalendar(false); // Hide the calendar once a date is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title,
      distance,
      speed,
      date,
      time,
      details,
      mapId,
      createdAt,
      dateString,
      privateRide,
      userId,
      meetingPoint
    };

    try {
      await axios.post('http://localhost:3500/createride', body);
      setTitle('');
      setDistance('');
      setSpeed('');
      setDate(new Date());
      setTime('');
      setDetails('');
      setMapId(undefined);
      navigate('/ride/mine');
    } catch (error) {
      // If there is an error in the response
      if (error.response && error.response.data && error.response.data.error) {
        // Set the error message to state
        setError(error.response.data.error);
      } else {
        // Handle other types of errors
        console.error('Error:', error.message);
        setError('An error occurred while creating the ride.');
      }
    }
  };

  // console.log(title, distance, speed, date, time, details, mapId)

  return (
    <>
      {user.loggedIn ? (
        <>
          <div className="rides">
            <form
              className="ridesform"
              onSubmit={handleSubmit}
            >
              <label>Ride title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required></input>

              <label>
                Private
                <input
                  type="checkbox"
                  checked={privateRide}
                  onChange={handleChange}
                />
              </label>
              <label>
                Public
                <input
                  type="checkbox"
                  checked={publicRide}
                  onChange={handleChange}
                />
              </label>

              <label>Date</label>

              <input
                onClick={handleDateInputClick}
                onChange={(e) => setDate(e.target.value)}
                value={dateString}
                required></input>

              {showCalendar && <CalendarComponent date={date} setDate={handleDateSelect} />}


              <label>Distance (Km)</label>
              <input
                type="text"
                // Positive number or pattern 22-24
                // pattern="(\d+(\.\d+)?|(\d+(\.\d+)?)?-\d+(\.\d+)?)"
                pattern="\d+(\.\d+)?"
                title="Distance must be a positive number"
                onChange={(e) => setDistance(e.target.value)}
                value={distance}
                required
              />


              <label>Speed (Km/h)</label>
              <input
                type="text"
                // pattern="(\d+(\.\d+)?|(\d+(\.\d+)?)?-\d+(\.\d+)?)"
                pattern="\d+(\.\d+)?"
                title="Speed must be a positive number"
                onChange={(e) => setSpeed(e.target.value)}
                value={speed}
                required
              />


              <label>Starting Time</label>
              {/* <input
              type="text"
              pattern="^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$"
              title="Format HH:MM:SS - 00:00:00 - 23:59:59"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required></input> */}

              <TimePickerComponent time={time} setTime={setTime} />

              <label>Meeting Point</label>
              <input
                onChange={(e) => setMeetingPoint(e.target.value)}
                value={meetingPoint}
                required></input>


              <label>Details</label>
              <input
                onChange={(e) => setDetails(e.target.value)}
                value={details}
                required></input>


              <label>Map</label>
{maps?.length
  ?
  <select
    // className="allmaps"
    value={mapId}
    onChange={(e) =>
      setMapId(e.target.value)
    }
    disabled={!maps || maps.length === 0} // Disable the dropdown if maps are not available
  >
    {maps.map((map, index) =>
      <option
        key={index}
        value={map.id}
      >
        Title: {map.title}
      </option>
    )}
  </select>
  :
  <p>No maps to display</p>
}
<button type="submit" disabled={!mapId}>Create</button> {/* Disable the submit button if mapId is undefined */}
              {error && <p>Error: {error}</p>}
            </form>



          </div>
          {mapId && mapId !== null && mapId !== undefined && 
                <PreviewMap mapId={mapId} setMapId={setMapId} />
                }
    
        </>


      ) : (
        <p>Please log in to create a ride.</p>
      )}


    </>

  )
}