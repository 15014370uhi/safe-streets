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
import { getPredictions, getHistoricCrimes, getThreatLevel} from "../util/GetCrimeData";

import CardDeck from "react-bootstrap/CardDeck";
import { useHistory } from "react-router-dom";
import { Crimes } from "../contexts/CrimeDataContext";
import FadeIn from "react-fade-in";
import { ResultsData } from "../contexts/ResultsDataContext";


const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [crimesToDisplay, setCrimesToDisplay] = useContext(Crimes); // crimes data context
	const [resultsData, setResultsData] = useContext(ResultsData);

	const history = useHistory();

	useEffect(() => {
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// updates the mapDetails context
	const updateMap = async (aTimestamp) => {
		var aFavourite = await getUserFavourite(aTimestamp);

		// update context with data from saved favourite
		setMapDetails((mapDetails) => ({
			allCrimes: aFavourite.allCrimes,
			locationName: aFavourite.locationName,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			filters: aFavourite.filters,
		}));

		setCrimesToDisplay(aFavourite.allCrimes);
		
		const payload = {
			lat: aFavourite.lat,
			lon: aFavourite.lon,
		};
		// populate predictions and historic data for favourite
		var predictionsResponse = await getPredictions(payload);
		var threatLevel = getThreatLevel(predictionsResponse.predictions);		
		var historicResponse = await getHistoricCrimes(payload);		
		
		setResultsData({
			predictions: predictionsResponse.predictions,
			historicCrimes: historicResponse.historicCrimes,
			threatLevel: threatLevel,
		});		

		history.push(`/mapdisplay`, {
			isfavourite: "true", //if map a previously favourited map or new search result
			timestamp: aTimestamp,
			threatlevel: threatLevel,
		});
	};

	

	// function which deletes a specific favourited map
	const deleteFavourite = async (aTimestamp) => {
		await deleteUserFavourite(aTimestamp);
		getFavourites();
	};

	// function which gets all user favourited maps
	const getFavourites = async () => {
		var favouritesReturned = await getUserFavourites();
		setLocalFavourites(favouritesReturned);
	};

	return (
		<Container className={"favourites-container"}>
			<ButtonBack id="back-btn-favourites" />
			<FadeIn delay={240}>
				<Container>					
						<Container id="favourites-list-Container">
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
										displayMap={updateMap}
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
			</FadeIn>
		</Container>
	);
};

export default Favourites;
