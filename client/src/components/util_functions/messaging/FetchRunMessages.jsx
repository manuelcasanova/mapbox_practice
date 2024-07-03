import axios from 'axios';

const fetchRunMessages = async (runId, auth) => {
    // console.log("rideId fetchRunMessage", rideId)
    const BACKEND = process.env.REACT_APP_API_URL;
  try {
    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/runs/messages`, {
      params: {
        run_id: runId
      }
    });
    // console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching run messages:', error);
    return [];
  }
};

export default fetchRunMessages;
