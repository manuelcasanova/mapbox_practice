import axios from 'axios';

const MuteUserButton = ({ userId, userLoggedin, isMuted, setMutedUsers }) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const muteUser = () => {
    axios.post(`${BACKEND}/users/mute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => [...prevMutedUsers, userId]);
      })
      .catch(error => {
        console.error('Error muting user:', error);
      });
  };

  const unmuteUser = () => {
    axios.post(`${BACKEND}/users/unmute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => prevMutedUsers.filter(id => id !== userId));
      })
      .catch(error => {
        console.error('Error unmuting user:', error);
      });
  };

  return (
    <>
      {isMuted ? (
        <button onClick={unmuteUser}>Unmute</button>
      ) : (
        <button onClick={muteUser}>Mute</button>
      )}
    </>
  );
};

export default MuteUserButton;
