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

  console.log(title, distance, speed, date, time, details)

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


      </form>

      <button
      // onClick={navigate('/')}
      >Create</button>
    </div>
  )
}