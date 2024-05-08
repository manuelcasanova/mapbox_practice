// import { useAuth } from '../Context/AuthContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Login from './Login';

// const Authentication = ({rideApp, setFromButton, setRideAppUndefined}) => {

//   // console.log("rideApp in Authentication", rideApp)

//   const { user, logInUser1, logInUser2, logInUser3, logInUser4, logInUser5, logOut } = useAuth();
//   const navigate = useNavigate()
//   const location = useLocation()
//   const from = location.state?.from?.pathname || "/rides/";



//   const handleLogout = () => {
//     logOut(setRideAppUndefined);
//     setFromButton(true);
//     navigate("/"); // Navigate to the root route after logout
//   };

//   // console.log("user in authentication", user)
// // console.log("user", user)

// const handleLogin = (loginFunction) => {
//   return () => {
//     loginFunction(rideApp);
//     navigate(from, { replace: true });
//   };
// };

//   return (
// <div>

//   {user.loggedIn && (
//     <div>
//       <>Logged in as {user.username}</>
//       <button className="button-logout" onClick={handleLogout}>
//         Log Out
//       </button>
//     </div>
//   )}
//   {!user.loggedIn && (
  
  
//     <div className="log-user-buttons">
//             <button className="button-login" onClick={handleLogin(logInUser1)}>
//         Log In As User 1
//       </button>
//       <button className="button-login" onClick={handleLogin(logInUser2)}>
//         Log In As User 2
//       </button>
//       <button className="button-login" onClick={handleLogin(logInUser3)}>
//         Log In as User 3
//       </button>
//       <button className="button-login" onClick={handleLogin(logInUser4)}>
//         Log In as User 4
//       </button>
//       <button className="button-login" onClick={handleLogin(logInUser5)}>
//         Log In As User 5
//       </button>
//       <Login rideApp={rideApp}/>

//     </div>
//   )}
// </div>



//   );
// };

// export default Authentication;
