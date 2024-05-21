import axios from 'axios';

const fetchRideMessages = async (rideId) => {
    // console.log("rideId fetchRideMessage", rideId)
    const BACKEND = process.env.REACT_APP_API_URL;
  try {
    const response = await axios.get(`${BACKEND}/rides/messages`, {
      params: {
        ride_id: rideId
      }
    });
    // console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching ride messages:', error);
    return [];
  }
};

export default fetchRideMessages;
