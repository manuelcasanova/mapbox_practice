import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import axios from 'axios';

export default function CreateMap() {

  const { user } = useAuth();

  // console.log("user", user)

  const navigate = useNavigate();

  //Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const createdAt = new Date().toISOString();

  useEffect(() => {
    // console.log(title)
  }, [title])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3500/createmap`, {
        title,
        user,
        createdAt
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
        <label>Map title</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required></input>
        <button
        // onClick={navigate('/')}
        >Create</button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  )
}