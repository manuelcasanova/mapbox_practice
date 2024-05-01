

//Libraries
import axios from 'axios';



export const deactivateUser = async (user) => {


  try {
   
    // console.log("setRidestatusupdated", setRideStatusUpdated)
    const userId = user.id;
 
    await axios.post(`http://localhost:3500/user/deactivate/${userId}`, {
      data: { userId, user }
    });



  } catch (error) {
    console.error(error);
  }
};


export const deleteUser = async (user) => {
  try {
    const userId = user.id;
    await axios.delete(`http://localhost:3500/user/delete/${userId}`, {
      data: { userId, user }
    });

  } catch (error) {
    console.error(error);
  }
};