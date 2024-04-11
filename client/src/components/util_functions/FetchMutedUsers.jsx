import axios from "axios";

const fetchMutedUsers = async (userLoggedin, setMutedUsers, setIsLoading, setError, isMounted) => {
  try {
    axios.get('http://localhost:3500/users/muted', { params: { userId: userLoggedin } })
      .then(response => {
        setMutedUsers(response.data.mutedUsers);
      })
      .catch(error => {
        console.error('Error fetching muted users:', error);
      });


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

export default fetchMutedUsers