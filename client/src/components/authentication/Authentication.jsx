import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {


  const { user, logInUser1, logInUser2, logInUser3, logInUser4, logInUser5, logOut } = useAuth();
  const navigate = useNavigate()




  const handleLogout = () => {
    logOut();
    navigate("/"); // Navigate to the root route after logout
  };

  // console.log("user in authentication", user)
// console.log("user", user)

  return (
<div>

  {user.loggedIn && (
    <div>
      <>Logged in as {user.username}</>
      <button className="button-logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )}
  {!user.loggedIn && (
  
  
    <div className="log-user-buttons">
            <button className="button-login" onClick={logInUser1}>
        Log In As User 1
      </button>
      <button className="button-login" onClick={logInUser2}>
        Log In As User 2
      </button>
      <button className="button-login" onClick={logInUser3}>
        Log In as User 3
      </button>
      <button className="button-login" onClick={logInUser4}>
        Log In as User 4
      </button>
      <button className="button-login" onClick={logInUser5}>
        Log In As User 5
      </button>

    </div>
  )}
</div>



  );
};

export default Authentication;
