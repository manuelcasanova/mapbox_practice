import axios from 'axios';

const fetchRideMessages = async (rideId, auth) => {
  
    const BACKEND = process.env.REACT_APP_API_URL;
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/rides/messages`, {
      params: {
        ride_id: rideId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ride messages:', error);
    return [];
  }
};

export default fetchRideMessages;
