import logo from './logo.svg';
import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import ShowMap from './components/ShowMap'
import MyMap from './components/ShowMap2';


function App() {
  return (
    <div className='app'>
    <Title />
    <Information />
    <MyMap />
    {/* <ShowMap /> */}
    </div>



  );
}

export default App;




