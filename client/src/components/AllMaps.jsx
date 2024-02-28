import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DrawMap from "./DrawMap";

export default function AllMaps() {
  const [maps, setMaps] = useState([]);
  const [mapId, setMapId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3500/maps', { signal: controller.signal });
        if (isMounted) {
          setMaps(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const deleteMap = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/delete/${id}`);
      setMaps(maps.filter(map => map.id !== id));
      console.log(`Map with ${id} id deleted`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : maps.length > 0 ? (
        <select
          className="allmaps"
          value={mapId}
          onChange={(e) => setMapId(e.target.value)}
        >
          {maps.map((map) => (
            <option key={map.id} value={map.id}>
              Id: {map.id}, Title: {map.title}, Created by: {map.createdby}
            </option>
          ))}
        </select>
      ) : (
        <p>No maps to display</p>
      )}

      <div>STEP 2: Add, edit or remove markers</div>
      <DrawMap mapId={mapId} />

      {maps.length > 0 && (
        <div className="mapslist">
          {maps.map((map, index) => (
            <div key={index} value={map.id}>
              Id: {map.id}, Title: {map.title}, Created by: {map.createdby}
              {map.id !== 1 && (
                <button onClick={() => deleteMap(map.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
