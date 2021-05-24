import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapURL} from './contexts/MapContext';
import {MapDetails} from './contexts/MapDetailsContext';
import './App.css';
import axios from 'axios'; //TEST
axios.defaults.withCredentials = true; //TEST

const App = () => {
  const [mapURL, setMapURL] = useState ('');
  const [mapDetails, setMapDetails] = useState ({
    mapURL: '',    
		isnamesearch: false,
    locationname: '',
		lat: '',
		lon: '',
		numberofmonths: 0,
    filters: [],
  });
  
			//categories: ['anti-social-behaviour'], //element categories[0] used as button id

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
