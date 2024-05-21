

//Libraries
import axios from 'axios';

const BACKEND = process.env.REACT_APP_API_URL;

export const activateUser = async (user, loggedInUser) => {

  try {
   

    const userId = user.id;
    const isUserLoggedIn = loggedInUser.loggedIn
   
 
    await axios.post(`${BACKEND}/user/activate/${userId}`, {
      data: { userId, isUserLoggedIn }
    });

    

  } catch (error) {
    console.error(error);
  }
};

export const deactivateUser = async (user, loggedInUser) => {

  try {
   

    const userId = user.userId;
    const isUserLoggedIn = loggedInUser.accessToken !== undefined
   
 
    await axios.post(`${BACKEND}/user/deactivate/${userId}`, {
      data: { userId, isUserLoggedIn }
    });

    

  } catch (error) {
    console.error(error);
  }
};


export const deleteUser = async (userObject, user, setUsers, loggedInUser) => {
  try {
    const userId = user.id;
    await axios.delete(`${BACKEND}/user/delete/${userId}`, {
      data: { userId, user, loggedInUser, userObject }
    });


    setUsers(prevUsers => {
      // Filter out the user that has been removed


      return prevUsers.filter(user => user.id !== userId);


    });

  } catch (error) {
    console.error(error);
  }
};