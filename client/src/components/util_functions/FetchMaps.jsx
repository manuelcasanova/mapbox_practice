import axios from "axios";

const fetchMaps = async (auth, setMaps, setAddToMyMaps, setIsLoading, setError, isMounted, filteredMaps, browCoords) => {

  console.log("BrowCoords in FetchMaps", browCoords)

  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/maps/public`, {
      params: {
        user: auth,
        filteredMaps,
        browCoords
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