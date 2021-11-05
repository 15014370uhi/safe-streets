import React, { useContext, useEffect, useState } from "react";
import Favourite from "../components/Favourite";
import { MapDetails } from "../contexts/MapDetailsContext";
import uuid from "react-uuid";
import Container from "react-bootstrap/Container";
import {deleteUserFavourite, getUserFavourites, getUserFavourite} from '../firebase';
import ButtonBack from "../components/ButtonBack";
import CardDeck from "react-bootstrap/CardDeck";
import { useHistory } from "react-router-dom";
import { Crimes } from "../contexts/CrimeDataContext";

const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [crimesToDisplay, setCrimesToDisplay] = useContext(Crimes); // crimes data context

	const history = useHistory();

	useEffect(() => {		
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	

	// updates the mapDetails context
	const updateMap = (aFavourite) => {
		// update context with data from saved favourite
		setMapDetails((mapDetails) => ({
			allCrimes: aFavourite.allCrimes,
			locationName: aFavourite.locationName,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			filters: aFavourite.filters,
		}));
		setCrimesToDisplay(aFavourite.allCrimes);
	};

	// display favourited map when clicked
	const displayMap = async (aTimestamp) => {
		var aFavourite = await getUserFavourite(aTimestamp); //TODO TEST
		updateMap(aFavourite);

		history.push(`/results`, {
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
	const getFavourites = async() => {
		var favouritesReturned = await getUserFavourites();
		setLocalFavourites(favouritesReturned);
	};

	return (
		<Container className={"favourites-container"}>
		<ButtonBack id="back-btn-favourites" />
			<Container>			
				{localFavourites.length ? (
					<Container id="favourites-list-Container">
						<br />						
						<h3 className="favourites-title">
							You have {localFavourites.length}
							{localFavourites.length > 1
								? " favourites"
								: " favourite"}
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
				) : (
					<div className="div-no-favourites">					
						<br />
						<h1 className="text-no-favourites">
						You have no favourites yet.
						</h1>
					</div>
				)}
			</Container>
		</Container>
	);
};

export default Favourites;
