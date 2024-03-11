import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PreviewMap from "./PreviewMap";
import CalendarComponent from "./CalendarComponent"
import { useAuth } from "./Context/AuthContext";

export default function CreateRide() {

  const { user } = useAuth();
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
  const [details, setDetails] = useState('');

  const [maps, setMaps] = useState();
  const [mapId, setMapId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const createdAt = new Date().toISOString();

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
  }, [userId]);

  useEffect(() => {
    // console.log("isLoading:", isLoading);
  }, [isLoading]);

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
      userId
    };

    try {
      await axios.post('http://localhost:3500/createride', body);
      setTitle('');
      setDistance('');
      setSpeed('');
      setDate(new Date());
      setTime('');
      setDetails('');
      navigate('/ride/mine');
    } catch (err) {
      console.error("error", err);
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
                onChange={(e) => setDate(e.target.value)}
                value={dateString}
                required></input>

              <CalendarComponent date={date} setDate={setDate} />


              <label>Distance (Km)</label>
              <input
                onChange={(e) => setDistance(e.target.value)}
                value={distance}
                required></input>


              <label>Speed (Km/h)</label>
              <input
                onChange={(e) => setSpeed(e.target.value)}
                value={speed}
                required></input>


              <label>Starting Time</label>
              <input
                onChange={(e) => setTime(e.target.value)}
                value={time}
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
                >
                  {maps.map((map, index) =>

                    <option
                      key={index}
                      value={map.id}
                    >
                      {/* {console.log("mapid", map.id)} */}
                      Title: {map.title}
                    </option>
                  )}
                </select>
                :
                <p>No maps to display</p>
              }

              <button type="submit">Create</button>
            </form>



          </div>
          <PreviewMap mapId={mapId} setMapId={setMapId} />
        </>


      ) : (
        <p>Please log in to create a ride.</p>
      )}


    </>

  )
}