import './App.css';

import RequireAuth from './components/authentication/RequireAuth';
import Title from './components/Title'
import Navbar from './components/Navbar'
import Navsidebar from './components/Navsidebar';
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import CreateMap from './components/CreateMap';
import CreateRide from './components/CreateRide';
import CreateRun from './components/CreateRun';
import AllMaps from './components/AllMaps';
import RidesPublic from './components/RidesPublic';
import RunsPublic from './components/RunsPublic';
import RidesUser from './components/RidesUser';
import RunsUser from './components/RunsUser';
import RidesAll from './components/admin_components/RidesAll';
import RunsAll from './components/admin_components/RunsAll';
import UsersAdmin from './components/UsersAdmin';
import UsersAll from './components/UsersAll';
import MapsPublic from './components/MapsPublic';
import Followee from './components/UsersFollowee';
import Followers from './components/UsersFollowers';
import MutedUsers from './components/UsersMuted';
import PendingUsers from './components/UsersPending';
import UsersMessaging from './components/messaging/UsersMessaging';
import FollowNotifications from './components/notifications/FollowNotifications';
import MessagesNotifications from './components/notifications/MessagesNotifications';
import Welcome from './components/Welcome';
import UserProfile from './components/UserProfile';
import Register from './components/authentication/Register';
import Login from './components/authentication/Login';
import PersistLogin from './components/PersistLogin';
import ReportedMessages from './components/admin_components/ReportedMessages';
import ReportedRunMessages from './components/admin_components/ReportedRunMessages';
import ReportedNotifications from './components/notifications/ReportedNotifications'
import ReportedRunNotifications from './components/notifications/ReportedRunNotifications'
import FlaggedMessages from './components/admin_components/FlaggedMessages';
import FlaggedRunMessages from './components/admin_components/FlaggedRunMessages'
import ResetPassword from './components/authentication/ResetPassword';
import TestWebSocket from './components/util_functions/TestWebSocket';


//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';
import useAuth from './hooks/useAuth';

//Hooks
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { setOptions } from 'leaflet';


// Define a layout component to wrap the routes
const Layout = ({ children, rideApp, setRideApp, fromButton, setFromButton, setRideAppUndefined, showNavsidebar, toggleNavsidebar, handleMouseLeave, profilePicture, setProfilePicture }) => {

  const { auth } = useAuth()




  const isAdmin = auth.isAdmin

  return (

    <div className='app-and-head'>

      <div className='head'>
        <Title rideApp={rideApp} setRideApp={setRideApp} />
        <Navbar setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} setRideAppUndefined={setRideAppUndefined} profilePicture={profilePicture} setProfilePicture={setProfilePicture} />

        {showNavsidebar &&
          <Navsidebar rideApp={rideApp} fromButton={fromButton} setFromButton={setFromButton} setRideAppUndefined={setRideAppUndefined} toggleNavsidebar={toggleNavsidebar} handleMouseLeave={handleMouseLeave} profilePicture={profilePicture} setProfilePicture={setProfilePicture} />
        }
      </div>



      <div className='app'>

        <div className='hamburger-menu' onClick={toggleNavsidebar}
        // onMouseEnter={toggleNavsidebar}
        >
          <div className={showNavsidebar ? 'line-white' : 'line'}></div>
          <div className={showNavsidebar ? 'line-white' : 'line'}></div>
          <div className={showNavsidebar ? 'line-white' : 'line'}></div>
        </div>

        {rideApp === true && (
          <>
            <FollowNotifications />
            <MessagesNotifications />
            {isAdmin && <ReportedNotifications />}
          </>
        )}
        {rideApp === false && (
          <>
            <FollowNotifications />
            <MessagesNotifications />
            {isAdmin && <ReportedRunNotifications />}
          </>
        )}



        {children}


      </div>
      <Footer rideApp={rideApp} />

    </div>

  );
};


function App() {

  const { auth } = useAuth()

  // console.log("auth in app", auth)

  const [fromButton, setFromButton] = useState(false)
  const [rideApp, setRideApp] = useState(true)
  //before (). It worked well until PersistLogin on reload page

  const [showNavsidebar, setShowNavsidebar] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const BACKEND = process.env.REACT_APP_API_URL;
  // console.log("prof pic in ap", profilePicture)


  useEffect(() => {
    if (auth.profilePicture) {

      if (auth.profilePicture.includes(`${BACKEND}`)) {
        setProfilePicture(`${auth.profilePicture}`);
      } else {
        setProfilePicture(`${BACKEND}/${auth.profilePicture}`);
      }


    } else {
      setProfilePicture(`${BACKEND}/profile_pictures/user.jpg`);
    }
  }, [auth.profilePicture]);

  useEffect(() => {
    // console.log("ride app in app.js", rideApp)
  }, [rideApp, profilePicture])


  const toggleNavsidebar = () => {
    setShowNavsidebar(!showNavsidebar);
  };

  const handleMouseLeave = () => {
    setShowNavsidebar(false);
  };

  const handleSetRideApp = () => {
    // Function to update the state in the parent component
    setRideApp(true)
  };

  const handleSetRunApp = () => {
    // Function to update the state in the parent component
    setRideApp(false)
  };

  const setRideAppUndefined = () => {
    setRideApp(undefined)
  }

  return (
    <BrowserCoordsProvider>
      <Router>
        {/* {showNavsidebar && <Navsidebar setFromButton={setFromButton}/>} */}

        <Routes>
          {/* Route for the Welcome component */}
          <Route exact path="/" element={<Welcome rideApp={rideApp} handleSetRideApp={handleSetRideApp} handleSetRunApp={handleSetRunApp} />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login rideApp={rideApp} setFromButton={setFromButton} setRideAppUndefined={setRideAppUndefined} />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Route for other components with the Layout */}
          <Route
            path="/*"
            element={
              <Layout
                showNavsidebar={showNavsidebar}
                toggleNavsidebar={toggleNavsidebar}
                rideApp={rideApp}
                setRideApp={setRideApp}
                fromButton={fromButton}
                setFromButton={setFromButton}
                setRideAppUndefined={setRideAppUndefined}
                handleMouseLeave={handleMouseLeave}
                profilePicture={profilePicture}
              >

                <Routes>
                  <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth  />}><Route exact path="/rides" element={<></>}/></Route>
                    {/* <Route element={<RequireAuth  />}><Route exact path="/websocket" element={<TestWebSocket />}/></Route> */}
                    <Route element={<RequireAuth  />}><Route exact path="/runs" element={<></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/maps" element={<><AllMaps fromButton={fromButton} setFromButton={setFromButton} rideApp={rideApp} /></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/maps/public" element={<><MapsPublic /></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/maps/create" element={<><CreateMap setFromButton={setFromButton} /></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/maps/:id" element={<><SeeMap /></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/createride" element={<><CreateRide /></>}/></Route>
                    <Route element={<RequireAuth  />}><Route exact path="/createrun" element={<><CreateRun /></>}/></Route>

                    <Route element={<RequireAuth  />}><Route exact path="/rides/public" element={<><RidesPublic /></>}/></Route>

                     <Route element={<RequireAuth  />}><Route exact path="/runs/public" element={<><RunsPublic /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/rides/mine" element={<><RidesUser /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/runs/mine" element={<><RunsUser /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/rides/all" element={<><RidesAll /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/runs/all" element={<><RunsAll /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/rides/messages/reported" element={<><ReportedMessages /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/runs/messages/reported" element={<><ReportedRunMessages /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/runs/messages/flagged" element={<><FlaggedRunMessages /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/rides/messages/flagged" element={<><FlaggedMessages /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/admin" element={<><UsersAdmin /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/all" element={<><UsersAll /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/followee" element={<><Followee /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/followers" element={<><Followers /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/muted" element={<><MutedUsers /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/pending" element={<><PendingUsers /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/users/messaging/:userId" element={<><UsersMessaging /></>}/></Route>
                     <Route element={<RequireAuth  />}><Route exact path="/user/profile" element={<><UserProfile setRideAppUndefined={setRideAppUndefined} profilePicture={profilePicture} setProfilePicture={setProfilePicture} /></>}/></Route>
                  </Route>
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </BrowserCoordsProvider>
  );
}

export default App;




