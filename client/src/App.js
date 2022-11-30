import logo from './logo.svg';
import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import ShowMap from './components/ShowMap'
import MapClick from './components/MapClick';
import MapConnect from './components/MapConnect'
import MapFunctionalComponent from './components/MapFunctionalComponent';


function App() {
  return (
    <div className='app'>
    <Title />
    <Information />
    <MapFunctionalComponent />
    <MapClick />
    {/* <ShowMap /> */}
    {/* <MapConnect /> */}
    </div>



  );
}

export default App;




