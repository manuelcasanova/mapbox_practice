import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import CreateMap from './components/CreateMap';
import CreateRide from './components/CreateRide';
import Authentication from './components/authentication/Authentication'
import AllMaps from './components/AllMaps';
import RidesPublic from './components/RidesPublic';
import RidesUser from './components/RidesUser'
import RidesAll from './components/admin_components/RidesAll';
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


//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';

//Hooks
import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Define a layout component to wrap the routes
const Layout = ({ children, rideApp, setRideApp, fromButton, setFromButton, setRideAppUndefined }) => (
  <div className='app'>
    <FollowNotifications />
    <MessagesNotifications />
    <Title rideApp={rideApp} setRideApp={setRideApp} />
    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
    {children}
    <Footer />
  </div>
);




function App() {


  const [fromButton, setFromButton] = useState(false)
  // console.log("fromButton", fromButton)
  const [rideApp, setRideApp] = useState() //before true
  //  console.log("rideApp in App.js", rideApp)
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

//If ride App is false, change to true on Welcome component mount, default state.
  // useEffect(() => {
  //   if (!rideApp) {
  //     handleSetRideApp(); 
  //   }
  // }, [rideApp]);

  //  console.log("rideApp in Appjs", rideApp)
  return (
    // <AuthProvider rideApp={rideApp}>
      <BrowserCoordsProvider>
        <Router>
          <Routes>
            {/* Route for the Welcome component */}
            <Route exact path="/" element={<Welcome rideApp={rideApp} handleSetRideApp={handleSetRideApp} handleSetRunApp={handleSetRunApp}/>} />

            <Route exact path="/register" element={<Register/>} />

            {/* <Route exact path="/login" element={<Authentication rideApp={rideApp}  setFromButton={setFromButton} setRideAppUndefined={setRideAppUndefined} />} /> */}
            <Route exact path="/login" element={<Login rideApp={rideApp}  setFromButton={setFromButton} setRideAppUndefined={setRideAppUndefined} />} />


            {/* Route for other components with the Layout */}
            <Route
              path="/*"
              element={
                <Layout
                  rideApp={rideApp}
                  setRideApp={setRideApp}
                  fromButton={fromButton}
                  setFromButton={setFromButton}
                  setRideAppUndefined={setRideAppUndefined}
                >
                  <Routes>
                    <Route exact path="/rides" element={<></>}> </Route>
                    <Route exact path="/run" element={<></>}> </Route>
                    <Route exact path="/maps" element={<><AllMaps fromButton={fromButton} setFromButton={setFromButton} /></>}> </Route>
                    <Route exact path="/maps/public" element={<><MapsPublic /></>}></Route>
                    <Route exact path="/maps/create" element={<><CreateMap setFromButton={setFromButton} /></>}></Route>
                    <Route exact path="/maps/:id" element={<><SeeMap /></>}></Route>
                    <Route exact path="/ride" element={<><CreateRide /></>}></Route>
                    <Route exact path="/rides/public" element={<><RidesPublic /></>}></Route>
                    <Route exact path="/rides/mine" element={<><RidesUser /></>}></Route>
                    <Route exact path="/rides/all" element={<><RidesAll /></>}></Route>
                    <Route exact path="/users/admin" element={<><UsersAdmin /></>}></Route>
                    <Route exact path="/users/all" element={<><UsersAll /></>}></Route>
                    <Route exact path="/users/followee" element={<><Followee /></>}></Route>
                    <Route exact path="/users/followers" element={<><Followers /></>}></Route>
                    <Route exact path="/users/muted" element={<><MutedUsers /></>}></Route>
                    <Route exact path="/users/pending" element={<><PendingUsers /></>}></Route>
                    <Route exact path="/users/messaging/:userId" element={<><UsersMessaging /></>}></Route>
                    <Route exact path="/user/profile" element={<><UserProfile setRideAppUndefined={setRideAppUndefined}/></>}></Route>
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </BrowserCoordsProvider>
    // </AuthProvider>






  );
}

export default App;




