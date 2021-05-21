import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapURL} from './contexts/MapContext';
import './App.css';
import axios from 'axios'; //TEST
axios.defaults.withCredentials = true; //TEST

const App = () => {
  const [mapURL, setMapURL] = useState ('a default MapURL');

  return (
    <MapURL.Provider value={[mapURL, setMapURL]}>
      <UserProvider>
        <Application />
      </UserProvider>
    </MapURL.Provider>
  );
};
export default App;
