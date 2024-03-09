import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import axios from 'axios';

export default function CreateMap() {

  const { user } = useAuth();
  const [privateMap, setPrivateMap] = useState(true);
  const [publicMap, setPublicMap] = useState(false);

  // console.log("user", user)

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const createdAt = new Date().toISOString();

  const handleChange = () => {
    setPrivateMap(!privateMap);
    setPublicMap(!publicMap);
  };


  useEffect(() => {
    // console.log(title)
  }, [title])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3500/createmap`, {
        title,
        user,
        createdAt,
        privateMap
      });

      setTitle('');
      navigate('/maps');
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred");
    }
  };


  return (
    <div className="maps">
      <form onSubmit={handleSubmit}>
        <div>STEP 1: CREATE a new map or SELECT an existing map</div>

        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required></input>
        <label>
          Private
          <input
            type="checkbox"
            checked={privateMap}
            onChange={handleChange}
          />
        </label>
        <label>
          Public
          <input
            type="checkbox"
            checked={publicMap}
            onChange={handleChange}
          />
        </label>
        <button
        // onClick={navigate('/')}
        >Create</button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  )
}