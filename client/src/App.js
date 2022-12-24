import './App.css';

import Title from './components/Title'
import Information from './components/Information'
import DrawMap from './components/DrawMap';
import Footer from './components/Footer';
import SeeMap from './components/SeeMap';
import { useState } from 'react';


function App() {

//For production only
const [refresh, setRefresh] = useState(0)

  return (
    <div className='app'>


    <Title />
    <Information />

    <DrawMap refresh={refresh} setRefresh={setRefresh}/>
    <SeeMap refresh={refresh} setRefresh={setRefresh}/>
  
    <Footer />
    </div>
  );
}

export default App;




