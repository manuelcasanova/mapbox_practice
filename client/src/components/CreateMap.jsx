import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function CreateMap() {

const navigate = useNavigate();

//Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');

  useEffect(() => {
    // console.log(title)
  }, [title])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`http://localhost:3500/createmap`,
            {title}
        );
        setTitle('');
        navigate('/')
    } catch (err) {
        console.log("error", err)
    }
}

  return (
    <div className="newmap">
      <form onSubmit={handleSubmit}>
      <div>STEP 1: Create a new map</div>
      <label>Map title</label>
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required></input>
        <button
        // onClick={navigate('/')}
        >Create</button>
      </form>
      
      
    </div>
  )
}