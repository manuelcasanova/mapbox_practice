import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import DrawMap from './components/DrawMap';
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import CreateMap from './components/CreateMap';

//Hooks
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllMaps from './components/AllMaps';


function App() {

  //For production only
  const [refresh, setRefresh] = useState(0)

  return (
    <Router>
      <div className='app'>
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
            exact path="/maps/:id"
            element={
              <>
              <Title />
              <Information />
              <AllMaps />
              <SeeMap refresh={refresh} setRefresh={setRefresh} />
              </>
            
            }>
          </Route>

          <Route
            exact path="/maps"
            element={
              <>
                <Title />
                {/* <Information /> */}
                <CreateMap />
                <AllMaps />
                <Footer />
              </>
            }>
          </Route>

        </Routes>
      </div>
    </Router >
  );
}

export default App;




