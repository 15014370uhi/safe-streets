import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapURL} from './contexts/MapContext';
import {MapDetails} from './contexts/MapDetailsContext';
import './App.css';
import axios from 'axios'; //TEST
axios.defaults.withCredentials = true; //TEST

const App = () => {
  const [mapURL, setMapURL] = useState ('');//TODO dont need this context anymore do I????
  const [mapDetails, setMapDetails] = useState ({});  

  return (
    <MapDetails.Provider value={[mapDetails, setMapDetails]}>
    <MapURL.Provider value={[mapURL, setMapURL]}> 
      <UserProvider>
        <Application />
      </UserProvider>
    </MapURL.Provider>
    </MapDetails.Provider>
  );
};
export default App;
