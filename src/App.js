import React, {useState} from 'react';
import Application from './components/Application';
import UserProvider from './auth/UserProvider';
import {MapDetails} from './contexts/MapDetailsContext';
import {ResultsData} from './contexts/ResultsDataContext';
import {Crimes} from './contexts/CrimeDataContext';
import {CenterPoint} from './contexts/CenterPointContext';

import './App.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

const App = () => {
  const [mapDetails, setMapDetails] = useState ({});
  const [resultsData, setResultsData] = useState ({});
  const [crimeData, setCrimeData] = useState ({});
  const [centerPoint, setCenterPoint] = useState ({});

  return (
    <CenterPoint.Provider value={[centerPoint, setCenterPoint]}>
      <Crimes.Provider value={[crimeData, setCrimeData]}>
        <ResultsData.Provider value={[resultsData, setResultsData]}>
          <MapDetails.Provider value={[mapDetails, setMapDetails]}>
            <UserProvider>
              <Application />
            </UserProvider>
          </MapDetails.Provider>
        </ResultsData.Provider>
      </Crimes.Provider>
    </CenterPoint.Provider>
  );
};
export default App;
