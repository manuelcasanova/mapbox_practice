import axios from 'axios';

const fetchReportedRunMessages = async ({auth}) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  // console.log("auth", auth)
  const isAdmin = auth.isAdmin
  try {
    const response = await axios.get(`${BACKEND}/runs/messages/reported`, {
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
