import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import '../styles/Create.css'

export default function CreateMap({ setFromButton }) {

  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate()
  const { auth, setMapId } = useAuth();
  const [mapType, setMapType] = useState("public");

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const createdAt = new Date().toISOString();

  const handleChange = (e) => {
    const { value } = e.target;
    setMapType(value);
  };

  useEffect(() => {
    setFromButton(false);
  }, [setFromButton]);

  useEffect(() => {
  }, [title])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(`${BACKEND}/createmap`, {
        title,
        auth,
        createdAt,
        mapType
      });
      setMapId(response.data.id)
      setTitle('');
      navigate('/maps');
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred");
    }
  };


  return (

    <>
      {auth.accessToken !== undefined ? (
        <div className="create-map-container">
          <form onSubmit={handleSubmit}>
            <div>STEP 1: Name the map</div>

            <input
              onChange={(e) => {
                const userInput = e.target.value;
                if (userInput.length <= 255) {
                  setTitle(userInput);
                }
              }}
              value={title}
              required></input>


            <div className="create-map-label-input">
              <label className="create-map-label">
                Visibility
              </label>
              <select
                value={mapType}
                onChange={handleChange}
                name="mapType"
              >
                <option value="public">Everyone</option>
                <option value="followers">Followers</option>
                <option value="private">Only me</option>
              </select>

            </div>

            <button
              disabled={!title}
              className="create-map-button"
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