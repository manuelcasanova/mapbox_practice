import axios from 'axios';

import { faBellSlash, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MuteUserButton = ({ userId, userLoggedin, isMuted, setMutedUsers, onMutedChange, handleRefresh }) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const muteUser = () => {
    axios.post(`${BACKEND}/users/mute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => [...prevMutedUsers, userId]);
        onMutedChange();
      })
      .catch(error => {
        console.error('Error muting user:', error);
      });
  };

  const unmuteUser = () => {
    axios.post(`${BACKEND}/users/unmute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => prevMutedUsers.filter(id => id !== userId));
        onMutedChange();
      })
      .catch(error => {
        console.error('Error unmuting user:', error);
      });
  };

  return (
    <>
      {isMuted ? (
        <button title="Unmute user" onClick={unmuteUser}><FontAwesomeIcon icon={faBell}></FontAwesomeIcon></button>
      ) : (
        <button title="Mute user" onClick={muteUser}> <FontAwesomeIcon icon={faBellSlash} /></button>
      )}
    </>
  );
};

export default MuteUserButton;
