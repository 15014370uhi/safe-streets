import React, { useState } from "react";
import Application from "./components/Application";
import UserProvider from "./auth/UserProvider";
import { MapDetails } from "./contexts/MapDetailsContext";
import { ResultsData } from "./contexts/ResultsDataContext";
import { Crimes } from "./contexts/CrimeDataContext";

import "./App.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const App = () => {
	const [mapDetails, setMapDetails] = useState({});
	const [resultsData, setResultsData] = useState({});
	const [crimesToDisplay, setCrimesToDisplay] = useState({});

	return (
		<Crimes.Provider value={[crimesToDisplay, setCrimesToDisplay]}>
			<ResultsData.Provider value={[resultsData, setResultsData]}>
				<MapDetails.Provider value={[mapDetails, setMapDetails]}>
					<UserProvider>
						<Application />
					</UserProvider>
				</MapDetails.Provider>
			</ResultsData.Provider>
		</Crimes.Provider>
	);
};
export default App;
