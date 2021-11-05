import React, { useContext, useEffect, useState } from "react";
import Favourite from "../components/Favourite";
import { MapDetails } from "../contexts/MapDetailsContext";
import { UserContext } from "../auth/UserProvider";
import uuid from "react-uuid";
import Container from "react-bootstrap/Container";
import firebase from "firebase";
import {testDeleteFavourite, testGetFavourites} from '../firebase';

import CardDeck from "react-bootstrap/CardDeck";
import { useHistory } from "react-router-dom";
import { Crimes } from "../contexts/CrimeDataContext";

const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const user = useContext(UserContext); //get User Context for ID
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [crimesToDisplay, setCrimesToDisplay] = useContext(Crimes); // crimes data context

	const history = useHistory();

	useEffect(() => {
		//getFavourites();
		aTestGetFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Function which retrieves a favourite record from firebase for a user
	const getFavourite = async (aTimestamp) => {
		// reconsole.log('getFavourite', aTimestamp);
		var userRef = firebase.firestore().collection("users").doc(user.uid);
		await userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const aFavourite = doc
						.data()
						.favourites.find(
							({ timestamp }) => timestamp === aTimestamp
						);
					updateMap(aFavourite);
					//console.log('aFavourite.lat ' + aFavourite.lat + ', ' + aFavourite.lon);
				} else {
					console.log("No Matching favourite!");
				}
			})
			.catch(function (error) {
				console.log("Error getting favourites:", error);
			});
	};

	// updates the mapDetails context
	const updateMap = (aFavourite) => {
		//update context with data from saved favourite
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
		await getFavourite(aTimestamp);
		history.push(`/results`, {
			isfavourite: "true", //boolean flag to determine if map a previously favourited map or new search result
			timestamp: aTimestamp, //
		});
	};

	// function which retrieves the favourites for a user
	const getFavourites = async () => {
		var userRef = await firebase
			.firestore()
			.collection("users")
			.doc(user.uid);

		await userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					setLocalFavourites(doc.data().favourites); //TODO move favourites functions to separate
					//console.log('favourites from user account: ', doc.data().favourites);
				} else {
					console.log("No favourites!");
				}
			})
			.catch(function (error) {
				console.log("Error getting favourites:", error);
			});
	};



	const testDeleteFav = async (aTimestamp) => {
		//console.log('testDeleteFavourite: ' + aTimestamp);
		var favouritesToSet = await testDeleteFavourite(aTimestamp);
		//console.log('favourites returned: ' + favouritesToSet);

		//getFavourites();
		aTestGetFavourites();
	};

	const aTestGetFavourites = async() => {
		var favouritesReturned = await testGetFavourites();
		setLocalFavourites(favouritesReturned);
	}


	// remove a favourite from a user's collection of all favourites
	const deleteFavourite = (aTimestamp) => {
		var userRef = firebase.firestore().collection("users").doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter(
							(favourite) => favourite.timestamp !== aTimestamp
						);
					// update firestore doc with the filtered favourites
					userRef.update({
						favourites: favouritesToKeep,
					});
					// update favourites state
					setLocalFavourites(favouritesToKeep);
				} else {
					console.log("No favourites!");
				}
			})
			.catch(function (error) {
				console.log("Error getting favourites:", error);
			});
	};

	return (
		<Container className={"favourites-container"}>
			<Container>
				{localFavourites.length ? (
					<Container id="favouritesContainer">
						<br />
						<h3>
							You have {localFavourites.length}
							{localFavourites.length > 1
								? " favourites"
								: " favourite"}
						</h3>
						<CardDeck>
							{localFavourites.map((favourite) => (
								<Favourite
									key={uuid()}
									allCrimes={favourite.allCrimes}
									title={favourite.title}
									locationName={favourite.locationName}
									lat={favourite.lat}
									lon={favourite.lon}
									timestamp={favourite.timestamp}
									deleteFavourite={testDeleteFav}
									displayMap={displayMap}
								/>
							))}
						</CardDeck>
					</Container>
				) : (
					<div>
						<br />
						<br />
						<br />
						<br />
						<h1>You have no favourites yet.</h1>
					</div>
				)}
			</Container>
		</Container>
	);
};

export default Favourites;
