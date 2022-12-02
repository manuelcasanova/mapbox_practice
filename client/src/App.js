import logo from './logo.svg';
import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import ShowMap from './components/ShowMap'
import MapClick from './components/MapClick';
import MapConnect from './components/MapConnect'
import MapFunctionalComponent from './components/MapFunctionalComponent';
import RideMap from './components/RideMap';
import Polyline from './components/Polyline';
import Footer from './components/Footer';
import Bounds from './components/BoundsRideMap';
import BoundsRideMap from './components/BoundsRideMap';


function App() {
  return (
    <div className='app'>
    <Title />
    {/* <Polyline /> */}
    <Information />
    {/* <MapFunctionalComponent /> */}
    
    <RideMap />
    {/* <BoundsRideMap /> */}
    
    {/* <MapClick /> */}
    {/* <ShowMap /> */}
    {/* <MapConnect /> */}
    <Footer />
    </div>



  );
}

export default App;




