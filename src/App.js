import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapDetails} from './contexts/MapDetailsContext';
import './App.css';
import axios from 'axios'; 
axios.defaults.withCredentials = true; 

const App = () => {
  const [mapDetails, setMapDetails] = useState ({});  

  return (
    <MapDetails.Provider value={[mapDetails, setMapDetails]}>   
      <UserProvider>
        <Application />
      </UserProvider>   
    </MapDetails.Provider>
  );
};
export default App;