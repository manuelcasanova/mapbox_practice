import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PreviewMap from "./PreviewMap";
import CalendarComponent from "./CalendarComponent"
import TimePickerComponent from "./TimePickerComponent";
import useAuth from "../hooks/useAuth"
import '../styles/Create.css'


export default function CreateRun() {

  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth, mapId, setMapId } = useAuth();
  const userId = auth.userId;
  // console.log("userId in Create Run", auth)
  const [runType, setRunType] = useState("public");

  // console.log(runType)

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [distance, setDistance] = useState('');
  const [pace, setPace] = useState('');
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

  const handleChange = (e) => {
    const { value } = e.target;

    setRunType(value);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMaps = async () => {
      try {
        const response = await axios.get(`${BACKEND}/maps/shared`, {
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
      pace,
      date,
      time,
      details,
      mapId,
      createdAt,
      dateString,
      runType,
      userId,
      meetingPoint
    };

    try {
      await axios.post(`${BACKEND}/createrun`, body);
      setTitle('');
      setDistance('');
      setPace('');
      setDate(new Date());
      setTime('');
      setDetails('');
      setMapId(undefined);
      navigate('/runs/mine');
    } catch (error) {
      // If there is an error in the response
      if (error.response && error.response.data && error.response.data.error) {
        // Set the error message to state
        setError(error.response.data.error);
      } else {
        // Handle other types of errors
        console.error('Error:', error.message);
        setError('An error occurred while creating the run.');
      }
    }
  };

  // console.log(title, distance, pace, date, time, details, mapId)

  return (
    <>
      {auth.accessToken !== undefined ? (
  
        <div className="create-container">
        <label>Create a new run</label>
          <div className="container-list">
            <form
              className="container-form"
              onSubmit={handleSubmit}
            >
              <div className="create-level-input">
              <label>Run title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required></input>

</div>
   <div className="create-level-input">
              <label>
                  Visibility
              </label>
              <select
                value={runType}
                onChange={handleChange}
                name="runType"
              >
                <option value="public">Everyone</option>
                <option value="followers">Followers</option>
                <option value="private">Only me</option>
              </select>

          </div>

          <div className="create-level-input">
            <label>Date</label>

            <input
              onClick={handleDateInputClick}
              onChange={(e) => setDate(e.target.value)}
              value={dateString}
              required></input>
          </div>

          {showCalendar && <CalendarComponent date={date} setDate={handleDateSelect} />}

          <div className="create-level-input">
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
          </div>

          <div className="create-level-input">
            <label>Pace (Min/Km)</label>
            <input
              type="text"
              // pattern="(\d+(\.\d+)?|(\d+(\.\d+)?)?-\d+(\.\d+)?)"
              pattern="\d+(\.\d+)?"
              title="Pace must be a positive number"
              onChange={(e) => setPace(e.target.value)}
              value={pace}
              required
            />
          </div>
          <div className="create-time-label-input">
            <label>Starting Time</label>
            {/* <input
              type="text"
              pattern="^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$"
              title="Format HH:MM:SS - 00:00:00 - 23:59:59"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required></input> */}

            <TimePickerComponent time={time} setTime={setTime} />
          </div>
          <div className="create-level-input">
            <label>Meeting Point</label>
            <input
              onChange={(e) => setMeetingPoint(e.target.value)}
              value={meetingPoint}
              required></input>
          </div>
          <div className="create-level-input">
            <label>Details</label>
            <input
              onChange={(e) => setDetails(e.target.value)}
              value={details}
              required></input>
          </div>

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
            <p>No maps to select. Create or add a map.</p>
          }
          <button
            type="submit"
            className="create-button"
            disabled={!mapId || !title || !distance || !pace || !meetingPoint || !details}
          >Create
          </button>

          {error && <p>Error: {error}</p>}
        </form>



    </div>
          {
    mapId && mapId !== null && mapId !== undefined &&
    <PreviewMap mapId={mapId} setMapId={setMapId} />
  }

        </div>


      ) : (
    <p>Please log in to create a ride.</p>
  )
}


    </ >

  )
}