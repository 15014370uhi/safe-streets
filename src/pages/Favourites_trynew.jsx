import React, { useContext, useEffect, useState } from "react";
import Favourite from "../components/Favourite";
import { MapDetails } from "../contexts/MapDetailsContext";
import uuid from "react-uuid";
import Container from "react-bootstrap/Container";
import {
	deleteUserFavourite,
	getUserFavourites,
	getUserFavourite,
} from "../firebase";
import ButtonBack from "../components/ButtonBack";
import CardDeck from "react-bootstrap/CardDeck";
import { useHistory } from "react-router-dom";
import { Crimes } from "../contexts/CrimeDataContext";
import { getPredictions, getHistoricCrimes, testGetPredictions} from "../util/GetCrimeData";
import { ResultsData } from "../contexts/ResultsDataContext";
import axios from 'axios';


const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const [hasFavourites, setHasFavourites] = useState(false);
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [crimesToDisplay, setCrimesToDisplay] = useContext(Crimes); // crimes data context
	const [resultsData, setResultsData] = useContext(ResultsData);

	const history = useHistory();

	useEffect(() => {
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	// updates the mapDetails context
	const updateMap = async (aFavourite) => {			

		setCrimesToDisplay(aFavourite.allCrimes);

		// update context with data from saved favourite
		setMapDetails((mapDetails) => ({
			allCrimes: aFavourite.allCrimes,
			locationName: aFavourite.locationName,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			filters: aFavourite.filters,
			timestamp: aFavourite.timestamp,
		}));
		

		const payload = {
			lat: aFavourite.lat,
			lon: aFavourite.lon,
		};

	
		var predictions;
		var historicResponse; 
		
			await axios
			  .post ('http://localhost:4000/api/map/predictions', payload)
			  .then (res => {     
				predictions = res.data.predictions;
				console.log('predictions: ' + JSON.stringify(predictions));
			  });


			  await axios
			  .post ('http://localhost:4000/api/map/historic', payload)
			  .then (res => {     
				historicResponse = res.data.historicCrimes;
				console.log('historicResponse: ' + JSON.stringify(historicResponse));
			  });

		//TODO END TEST

		
		// populate predictions and historic data
		//var predictionsResponse = await getPredictions(payload);
		//console.log('predictions: ' + JSON.stringify(predictions));

		//var predictionsResponse = await testGetPredictions(payload);
		//= await getHistoricCrimes(payload);
		//console.log('historicResponse: ' + JSON.stringify(historicResponse));

		setResultsData({
			predictions: predictions,
			historicCrimes: historicResponse,
		});
	};

	// display favourited map when clicked
	const displayMap = async (aTimestamp) => {
		var aFavourite = await getUserFavourite(aTimestamp);
		await updateMap(aFavourite); //TODO added await		

		history.push(`/mapdisplay`, {
			isfavourite: "true", //if map a previously favourited map or new search result
			timestamp: aTimestamp,
		});
	};

	// Function which deletes a specific favourited map
	const deleteFavourite = async (aTimestamp) => {
		await deleteUserFavourite(aTimestamp);
		getFavourites();
	};

	// Function which gets all user favourited maps
	const getFavourites = async () => {
		var favouritesReturned = await getUserFavourites();		
		setLocalFavourites(favouritesReturned);
		if (favouritesReturned.length) {
			setHasFavourites(true);
		} else {
			setHasFavourites(false);
		}
	};

	return (
		<Container className={"favourites-container"}>
			<ButtonBack id="back-btn-favourites" />
			<Container>				
					<Container id="favourites-list-Container">
						<br />
						<h3
							className="favourites-title"
							style={{ opacity: "0.8" }}>
							You have {localFavourites.length}
							{localFavourites.length > 1 || localFavourites.length === 0
								? " favourites saved"
								: " favourite saved"}
						</h3>
						<CardDeck>
							{localFavourites.map((favourite) => (
								<Favourite
									key={uuid()}
									deleteFavourite={deleteFavourite}
									displayMap={displayMap}
									title={favourite.title}
									locationName={favourite.locationName}
									lat={favourite.lat}
									lon={favourite.lon}
									timestamp={favourite.timestamp}
								/>
							))}
						</CardDeck>
					</Container>				 
			</Container>
		</Container>
	);
};

export default Favourites;
