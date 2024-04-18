import axios from "axios";

const fetchPendingUsers = async (userLoggedin, isLoggedIn, setPendingUsers, setIsLoading, setError, isMounted) => {
  try {
    const response = await axios.get('http://localhost:3500/users/pending', { params: { userId: userLoggedin, isLoggedIn: isLoggedIn } });
    setPendingUsers(response.data.pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    if (isMounted) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  }
};

export default fetchPendingUsers;
