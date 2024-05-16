import axios from 'axios';

const fetchRunMessages = async (runId) => {
    // console.log("rideId fetchRunMessage", rideId)
  try {
    const response = await axios.get(`http://localhost:3500/runs/messages`, {
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
