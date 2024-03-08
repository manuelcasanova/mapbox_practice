import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import CreateMap from './components/CreateMap';
import CreateRide from './components/CreateRide';
import Authentication from './components/authentication/Authentication'

//Context
import BrowserCoordsProvider from './components/util_functions/GetBrowserLocation';
import { AuthProvider } from './components/Context/AuthContext';

//Hooks
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllMaps from './components/AllMaps';
import AllRides from './components/AllRides';


function App() {


  return (
    <AuthProvider>
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
                <SeeMap/>
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
    </AuthProvider>
  );
}

export default App;




