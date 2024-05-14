import axios from 'axios';

const fetchReportedMessages = async () => {
  try {
    const response = await axios.get(`http://localhost:3500/rides/messages/reported`);
    //  console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching reported messages:', error);
    return [];
  }
};

export default fetchReportedMessages;
