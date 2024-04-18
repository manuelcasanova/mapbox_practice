import axios from 'axios';

const MuteUserButton = ({ userId, userLoggedin, isMuted, setMutedUsers }) => {

  const muteUser = () => {
    axios.post('http://localhost:3500/users/mute', { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => [...prevMutedUsers, userId]);
      })
      .catch(error => {
        console.error('Error muting user:', error);
      });
  };

  const unmuteUser = () => {
    axios.post('http://localhost:3500/users/unmute', { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => prevMutedUsers.filter(id => id !== userId));
      })
      .catch(error => {
        console.error('Error unmuting user:', error);
      });
  };

  return (
    <div>
      {isMuted ? (
        <button onClick={unmuteUser}>Unmute</button>
      ) : (
        <button onClick={muteUser}>Mute</button>
      )}
    </div>
  );
};

export default MuteUserButton;
