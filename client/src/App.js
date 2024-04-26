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
import RidesAll from './components/RidesAll';
import UsersAdmin from './components/UsersAdmin';
import UsersAll from './components/UsersAll';
import MapsPublic from './components/MapsPublic';
import Followee from './components/UsersFollowee';
import Followers from './components/UsersFollowers';
import MutedUsers from './components/UsersMuted';
import PendingUsers from './components/UsersPending';
import UsersMessaging from './components/messaging/UsersMessaging';
import FollowNotifications from './components/notifications/FollowNotifications';

//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';
import { AuthProvider } from './components/Context/AuthContext';

//Hooks
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Define a layout component to wrap the routes
const Layout = ({ children, rideApp, setRideApp, fromButton, setFromButton }) => (
  <div className='app'>
    <Authentication />
    <FollowNotifications />
    <Title rideApp={rideApp} setRideApp={setRideApp} />
    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
    {children}
    <Footer />
  </div>
);


function App() {


  const [fromButton, setFromButton] = useState(false)
  const [rideApp, setRideApp] = useState(true)

  return (
    <AuthProvider>
      <BrowserCoordsProvider>
        <Router>

          <Layout
              rideApp={rideApp}
              setRideApp={setRideApp}
              fromButton={fromButton}
              setFromButton={setFromButton}
          >
            <Routes>

            <Route exact path="/" element={<></>}></Route>

              <Route
                exact path="/rides"
                element={
                  <>
     
                  </>

                }>
              </Route>

              <Route
                exact path="/run"
                element={
                  <>
     
                  </>

                }>
              </Route>

              <Route
                exact path="/maps"
                element={
                  <>
          
                    {/* <CreateMap /> */}
                    <AllMaps fromButton={fromButton} setFromButton={setFromButton} />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/public"
                element={
                  <>
           
                    {/* <CreateMap /> */}
                    <MapsPublic />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/create"
                element={
                  <>
           
                    <CreateMap setFromButton={setFromButton} />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/:id"
                element={
                  <>
           
                    <SeeMap />
                  </>

                }>
              </Route>

              <Route
                exact path="/ride"
                element={
                  <>
           
                    <CreateRide />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/public"
                element={
                  <>
           
                    <RidesPublic />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/mine"
                element={
                  <>
           
                    <RidesUser />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/all"
                element={
                  <>
           
                    <RidesAll />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/admin"
                element={
                  <>
           
                    <UsersAdmin />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/all"
                element={
                  <>
           
                    <UsersAll />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/followee"
                element={
                  <>
           
                    <Followee />
              
                  </>
                }>
              </Route>


              <Route
                exact path="/users/followers"
                element={
                  <>
           
                    <Followers />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/muted"
                element={
                  <>
           
                    <MutedUsers />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/pending"
                element={
                  <>
           
                    <PendingUsers />
              
                  </>
                }>
              </Route>

              <Route
                exact path="/users/messaging/:userId"
                element={
                  <>
           
                    <UsersMessaging />
              
                  </>
                }>
              </Route>



            </Routes>
          </Layout>
        </Router >

      </BrowserCoordsProvider>
    </AuthProvider>
  );
}

export default App;




