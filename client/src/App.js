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
import MapsPublic from './components/MapsPublic';
import UsersFollow from './components/UsersFollow';

//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';
import { AuthProvider } from './components/Context/AuthContext';

//Hooks
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




function App() {


  const [fromButton, setFromButton] = useState(false)

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
                    <Title />
                    <Information setFromButton={setFromButton} />
                  </>

                }>
              </Route>

              <Route
                exact path="/maps"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
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
                    <Title />
                    <Information setFromButton={setFromButton} />
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
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <CreateMap setFromButton={setFromButton} />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/maps/:id"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <SeeMap />
                  </>

                }>
              </Route>

              <Route
                exact path="/ride"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <CreateRide />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/public"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <RidesPublic />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/mine"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <RidesUser />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/rides/all"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <RidesAll />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/all"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <UsersAdmin />
                    <Footer />
                  </>
                }>
              </Route>

              <Route
                exact path="/users/follow"
                element={
                  <>
                    <Title />
                    <Information setFromButton={setFromButton} />
                    <UsersFollow />
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




