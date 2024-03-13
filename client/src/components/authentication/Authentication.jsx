import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {


  const { user, logInUser2, logInUser3, logInAdmin, logOut } = useAuth();
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
      <>Logged in as {user.id}</>
      <button className="button-logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )}
  {!user.loggedIn && (
  
    <div className="log-user-buttons">
      <button className="button-login" onClick={logInUser2}>
        Log In as User 2
      </button>
      <button className="button-login" onClick={logInUser3}>
        Log In as User 3
      </button>
      <button className="button-login" onClick={logInAdmin}>
        Log In As Admin
      </button>
    </div>
  )}
</div>



  );
};

export default Authentication;
