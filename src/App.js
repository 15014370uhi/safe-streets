import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
//import {MapURL} from './contexts/MapContext';
import {MapDetails} from './contexts/MapDetailsContext';
import './App.css';
import axios from 'axios'; 
axios.defaults.withCredentials = true; 

const App = () => {
  //const [mapURL, setMapURL] = useState ('');//TODO dont need this context anymore do I????
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

// return (
//   <MapDetails.Provider value={[mapDetails, setMapDetails]}>
//   <MapURL.Provider value={[mapURL, setMapURL]}> 
//     <UserProvider>
//       <Application />
//     </UserProvider>
//   </MapURL.Provider>
//   </MapDetails.Provider>
// );