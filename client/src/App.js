import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import DrawMap from './components/DrawMap';
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import CreateMap from './components/CreateMap';
import CreateRide from './components/CreateRide';
import Authentication from './components/authentication/Authentication'

//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';

//Hooks
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllMaps from './components/AllMaps';
import AllRides from './components/AllRides';


function App() {

  //For production only
  const [refresh, setRefresh] = useState(0)

  return (
    <BrowserCoordsProvider>
    <Router>
      <div className='app'>
        <Authentication/>
        <Routes>
          <Route
            exact path="/"
            element={
              <>
                <Title />
                <Information />
              </>

            }>
          </Route>

          <Route
            exact path="/maps"
            element={
              <>
                <Title />
                <Information />
                {/* <CreateMap /> */}
                <AllMaps />
                <Footer />
              </>
            }>
          </Route>

          <Route
            exact path="/maps/create"
            element={
              <>
                <Title />
                <Information />
                <CreateMap />
                <Footer />
              </>
            }>
          </Route>

          <Route
            exact path="/maps/:id"
            element={
              <>
                <Title />
                <Information />
                {/* <AllMaps /> */}
                <SeeMap refresh={refresh} setRefresh={setRefresh} />
              </>

            }>
          </Route>

          <Route
            exact path="/ride"
            element={
              <>
                <Title />
                <Information />
                <CreateRide />
                <Footer />
              </>
            }>
          </Route>

          <Route
            exact path="/ride/all"
            element={
              <>
                <Title />
                <Information />
                <AllRides />
                <Footer />
              </>
            }>
          </Route>

        </Routes>
      </div>
    </Router >
    </BrowserCoordsProvider>
  );
}

export default App;




