import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import DrawMap from './components/DrawMap';
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';

//Hooks
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


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
              <SeeMap refresh={refresh} setRefresh={setRefresh} />
              </>
            
            }>
          </Route>

          <Route
            exact path="/newmap"
            element={
              <>
                <Title />
                <Information />
                <DrawMap
                  refresh={refresh}
                  setRefresh={setRefresh} />
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




