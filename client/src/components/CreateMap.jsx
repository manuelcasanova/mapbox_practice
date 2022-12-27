import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

export default function CreateMap() {


//Pending use: useRef, focus, regex, error message, etc.

  const [title, setTitle] = useState('');

  useEffect(() => {
    console.log(title)
  }, [title])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`http://localhost:3500/createmap`,
            {title}
        );
        setTitle('');
    } catch (err) {
        console.log("error", err)
    }
}

  return (
    <div className="newmap">
      <form onSubmit={handleSubmit}>
      <label>Map title</label>
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required></input>
        <button>Create</button>
      </form>
      
      
    </div>
  )
}