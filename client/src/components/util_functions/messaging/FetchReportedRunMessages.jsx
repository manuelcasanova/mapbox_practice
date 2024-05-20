import axios from 'axios';

const fetchReportedRunMessages = async ({auth}) => {
  // console.log("auth", auth)
  const isAdmin = auth.isAdmin
  try {
    const response = await axios.get(`http://localhost:3500/runs/messages/reported`, {
    params: {
      isAdmin: isAdmin
    }
  });
    //  console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching reported messages:', error);
    return [];
  }
};

export default fetchReportedRunMessages;