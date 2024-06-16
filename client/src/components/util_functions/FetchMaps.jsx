import axios from "axios";

const fetchMaps = async (auth, setMaps, setAddToMyMaps, setIsLoading, setError, isMounted, filteredMaps) => {


  const BACKEND = process.env.REACT_APP_API_URL;
  try {
    const response = await axios.get(`${BACKEND}/maps/public`, {
      params: {
        user: auth,
        filteredMaps
      }

    });
    if (isMounted) {
      setAddToMyMaps(new Array(response.data.length).fill(false));
      setMaps(response.data);

      setIsLoading(false);
    }
  } catch (error) {
    if (isMounted) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError(error.message)
      }
      setIsLoading(false);
    }
  }
};

export default fetchMaps