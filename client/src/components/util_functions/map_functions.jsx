import axios from "axios";
  
  
  //Function to remove user from map
  export const removeUsersFromMap = async (userId, mapId, maps, setFake, setMaps) => {
    try {
      // Send request to remove users from map
      await axios.delete(`http://localhost:3500/maps/delete/users/${userId}`, {
        data: { mapId, userId } // Sending mapId in the request body
      });

      setMaps(prevMaps => {
        // Filter out the map that has been removed

        return prevMaps.filter(map => map.id !== mapId);

      });

      setFake(prev => !prev)
    } catch (error) {
      console.error('Error removing users from map:', error);
      // Handle error, maybe show an error message to the user
    }
  };

  //Function to delete map
  export const deleteMap = async (mapId, userId, isMapCreatedByUser, maps, setMaps, setFake, setConfirmDelete ) => {
    try {
      // Send request to remove users from map
      await axios.delete(`http://localhost:3500/delete/${mapId}`, {
        data: { mapId, userId, isMapCreatedByUser } // Sending mapId in the request body
      });
      // console.log(response.data);

      // If the request is successful, update the state to reflect the changes

      setMaps(prevMaps => {
        // Filter out the map that has been removed


        return prevMaps.filter(map => map.id !== mapId);


      });

      setFake(prev => !prev)
      setConfirmDelete(false)
    } catch (error) {
      console.error('Error removing users from map:', error);
      // Handle error, maybe show an error message to the user
    }
  };

    //Function to deactivate map
    export const deactivateMap = async (mapId, userId, isMapCreatedByUser, maps, setMaps, setFake, setConfirmDelete) => {
      try {
        // Send request to remove users from map
        await axios.post(`http://localhost:3500/deactivate/${mapId}`, {
          data: { mapId, userId, isMapCreatedByUser } // Sending mapId in the request body
        });
        // console.log(response.data);
  
        // If the request is successful, update the state to reflect the changes
  
        setMaps(prevMaps => {
          // Filter out the map that has been removed
  
  
          return prevMaps.filter(map => map.id !== mapId);
  
  
        });
  
        setFake(prev => !prev)
        setConfirmDelete(false)
      } catch (error) {
        console.error('Error deactivating map:', error);
        // Handle error, maybe show an error message to the user
      }
    };