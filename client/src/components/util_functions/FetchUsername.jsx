import axios from "axios";

const fetchUsernameAndId = async (auth, setUsers, setIsLoading, setError, isMounted, filteredUsers) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.auth?.accessToken || auth.accessToken}`

      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/users/names`, {
      params: {
        user: auth.auth ? auth.auth : auth,
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