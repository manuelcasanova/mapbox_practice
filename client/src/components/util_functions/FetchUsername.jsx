import axios from "axios";

const fetchUsernameAndId = async (auth, setUsers, setIsLoading, setError, isMounted, filteredUsers) => {

  const BACKEND = process.env.REACT_APP_API_URL;
  try {
    const response = await axios.get(`${BACKEND}/users/names`, {
      params: {
        user: auth,
        filteredUsers
      }
    });
    if (isMounted) {
      setUsers(response.data);
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

export default fetchUsernameAndId