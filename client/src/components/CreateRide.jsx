import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function CreateRide() {

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [distance, setDistance] = useState('');
  const [speed, setSpeed] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');

  const [maps, setMaps] = useState();
  const [mapId, setMapId] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); //Supported by axios.

    const getMaps = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setMaps(response.data);
        //In case all maps are deleted, we use this first state for mapId
        isMounted && setMapId(response.data[0].id)
      } catch (err) {
        console.error(err)
      }
    }

    getMaps();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])


  useEffect(() => {
    // console.log(title)
  }, [title])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3500/createmap`,
        { title }
      );
      setTitle('');
      navigate('/')
    } catch (err) {
      console.log("error", err)
    }
  }

  console.log(title, distance, speed, date, time, details, mapId)

  return (
    <div className="rides">
      <form
        className="ridesform"
        onSubmit={handleSubmit}>
        <label>Ride title</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required></input>

        <label>Date</label>
        <input
          onChange={(e) => setDate(e.target.value)}
          value={date}
          required></input>


        <label>Distance</label>
        <input
          onChange={(e) => setDistance(e.target.value)}
          value={distance}
          required></input>


        <label>Speed</label>
        <input
          onChange={(e) => setSpeed(e.target.value)}
          value={speed}
          required></input>


        <label>Time</label>
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
            onChange={(e) => setMapId(e.target.value)}
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


      </form>

      <button
      // onClick={navigate('/')}
      >Create</button>
    </div>
  )
}