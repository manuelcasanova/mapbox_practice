import axios from "axios";


const BACKEND = process.env.REACT_APP_API_URL;
//Function to remove user from map
export const removeUsersFromMap = async (userId, mapId, setFake, setMaps, auth) => {
  try {
    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });
    // Send request to remove users from map
    await axiosPrivate.delete(`${BACKEND}/maps/delete/users/${userId}`, {
      data: {
        mapId: mapId,
        userId: userId
      }
    });

    setMaps(prevMaps => {
      return prevMaps.filter(map => map.id !== mapId);
    });

    setFake(prev => !prev)
  } catch (error) {
    console.error('Error removing users from map:', error);
  }
};

//Function to delete map
export const deleteMap = async (mapId, userId, isMapCreatedByUser, maps, setMaps, setFake, setConfirmDelete, auth) => {
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });
    // Send request to remove users from map
    await axiosPrivate.delete(`${BACKEND}/delete/${mapId}`, {
      data: { mapId, userId, isMapCreatedByUser }
    });

    setMaps(prevMaps => {

      return prevMaps.filter(map => map.id !== mapId);


    });

    setFake(prev => !prev)
    setConfirmDelete(false)
  } catch (error) {
    console.error('Error removing users from map:', error);
  }
};

//Function to deactivate map
export const deactivateMap = async (mapId, userId, isMapCreatedByUser, maps, setMaps, setFake, setConfirmDelete, auth) => {
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });
    // Send request to remove users from map
    await axiosPrivate.post(`${BACKEND}/deactivate/${mapId}`, {
      data: { mapId, userId, isMapCreatedByUser }
    });

    setMaps(prevMaps => {
      return prevMaps.filter(map => map.id !== mapId);
    });

    setFake(prev => !prev)
    setConfirmDelete(false)
  } catch (error) {
    console.error('Error deactivating map:', error);
  }
};