import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import axios from 'axios';

export default function CreateMap({ setFromButton }) {

  const { user, setMapId } = useAuth();
  const [mapType, setMapType] = useState("public");

  // console.log("user", user)

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const createdAt = new Date().toISOString();

  const handleChange = (e) => {
    const { value } = e.target;

    setMapType(value);
  };


  useEffect(() => {
    setFromButton(false); // This will only run once after component mount
  }, [setFromButton]);

  useEffect(() => {
    // console.log(title)
  }, [title])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      const response = await axios.post(`http://localhost:3500/createmap`, {
        title,
        user,
        createdAt,
        mapType
      });
      setMapId(response.data.id) //Draw Map updates with the new maps's ID
      setTitle('');
      navigate('/maps');
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred");
    }
  };

  useEffect(() => {
    // console.log("map id after", mapId)
  })


  return (

    <>
      {user.loggedIn ? (
        <div className="maps">
          <form onSubmit={handleSubmit}>
            <div>STEP 1: Name the map</div>

            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required></input>

            <label>
              Visibility
              <select
                value={mapType}
                onChange={handleChange}
                name="mapType"
              >
                <option value="public">Everyone</option>
                <option value="followers">Followers</option>
                <option value="private">Only me</option>
              </select>
            </label>

            <button
              disabled={!title}
            // onClick={navigate('/')}
            >Create</button>
          </form>

          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <p>Please log in to create a map</p>
      )}


    </>
  )
}