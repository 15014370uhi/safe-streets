import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapDetails} from './contexts/MapDetailsContext';
import {ResultsData} from './contexts/ResultsDataContext';
import './App.css';
import axios from 'axios'; 
axios.defaults.withCredentials = true; 

const App = () => {
  const [mapDetails, setMapDetails] = useState ({});  
  const [resultsData, setResultsData] = useState ({});  

  return (
    <ResultsData.Provider value={[resultsData, setResultsData]}>
      <MapDetails.Provider value={[mapDetails, setMapDetails]}>   
       <UserProvider>
          <Application />
        </UserProvider>   
      </MapDetails.Provider>
    </ResultsData.Provider>
  );
};
export default App;