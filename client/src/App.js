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

//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';
import { AuthProvider } from './components/Context/AuthContext';

//Hooks
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




function App() {


  const [fromButton, setFromButton] = useState(false)
  const [rideApp, setRideApp] = useState(true)

  return (
    <AuthProvider>
      <BrowserCoordsProvider>
        <Router>
          <div className='app'>
            <Authentication />
            <Routes>

            <Route
                exact path="/"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                  </>

                }>
              </Route>

              <Route
                exact path="/rides"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                  </>

                }>
              </Route>

              <Route
                exact path="/run"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information />
                  </>

                }>
              </Route>

              <Route
                exact path="/maps"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    {/* <CreateMap /> */}
                    <AllMaps fromButton={fromButton} setFromButton={setFromButton} />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/public"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    {/* <CreateMap /> */}
                    <MapsPublic />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/create"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <CreateMap setFromButton={setFromButton} />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/:id"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <SeeMap />
                  </>

                }>
              </Route>

              <Route
                exact path="/ride"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <CreateRide />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/public"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <RidesPublic />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/mine"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <RidesUser />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/all"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <RidesAll />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/admin"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <UsersAdmin />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/all"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <UsersAll />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/followee"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <Followee />
                    <Footer />
                  </>
                }>
              </Route>


              <Route
                exact path="/users/followers"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <Followers />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/muted"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <MutedUsers />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/pending"
                element={
                  <>
                    <Title rideApp={rideApp} setRideApp={setRideApp}/>
                    <Information setFromButton={setFromButton} setRideApp={setRideApp} rideApp={rideApp} />
                    <PendingUsers />
                    <Footer />
                  </>
                }>
              </Route>



            </Routes>
          </div>
        </Router >
      </BrowserCoordsProvider>
    </AuthProvider>
  );
}

export default App;




