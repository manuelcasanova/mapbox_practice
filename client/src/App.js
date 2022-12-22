import logo from './logo.svg';
import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import ShowMap from './components/ShowMap'
import MapClick from './components/MapClick';
import MapConnect from './components/MapConnect'
import MapFunctionalComponent from './components/MapFunctionalComponent';
import DrawMap from './components/DrawMap';
import Polyline from './components/Polyline';
import Footer from './components/Footer';
import Bounds from './components/BoundsRideMap';
import BoundsRideMap from './components/BoundsRideMap';
import RideMapParent from './components/RideMapParent';
import RectangleComponent from './components/RectangleComponent';
import SeeMap from './components/SeeMap';
import { useState } from 'react';


function App() {

//For production only
const [refresh, setRefresh] = useState(0)

  return (
    <div className='app'>


    <Title />
    {/* <Polyline /> */}
    <Information />

    {/* <MapFunctionalComponent /> */}
    {/* <RideMapParent /> */}
    {/* <RectangleComponent/> */}

    <DrawMap refresh={refresh} setRefresh={setRefresh}/>
    <SeeMap refresh={refresh} setRefresh={setRefresh}/>
  
    
    
    {/* <RideMap /> */}
    {/* <BoundsRideMap /> */}

    
    {/* <MapClick /> */}
    {/* <ShowMap /> */}
    {/* <MapConnect /> */}
    <Footer />
    </div>



  );
}

export default App;




