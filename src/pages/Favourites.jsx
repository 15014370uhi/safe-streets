import React, {useContext, useEffect, useState} from 'react';
import Favourite from '../components/Favourite';
import {MapDetails} from '../contexts/MapDetailsContext';
import {UserContext} from '../auth/UserProvider';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';
import firebase from 'firebase';
import CardDeck from 'react-bootstrap/CardDeck';
import {useHistory} from 'react-router-dom';

const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const user = useContext(UserContext); //get User Context for ID
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const history = useHistory();

	useEffect(() => {
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//function which gets data for a single saved favourite
	const getFavourite = async (aTitle) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		await userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const aFavourite = doc
						.data() //TODO needs to retrieve using something other than mapURL
						.favourites.find(({title}) => title === aTitle); 					
					updateMap(aFavourite);
				} else {
					console.log('No Matching favourite!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

	// updates the mapDetails context
	const updateMap = (aFavourite) => {	
		//update context with data from saved favourite
		setMapDetails((mapDetails) => ({
			allCrimes: aFavourite.allCrimes,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			filters: aFavourite.filters
		}));
	};

	// display favourited map when clicked //TODO change to title or id or something
	const displayMap = async (aTitle) => {
		await getFavourite(aTitle);		
		history.push(`/results`, {
			isfavourite: 'true', //boolean flag to determine if map a previously favourited map or new search result
		});
	};

	//function which retrieves the favourites for a user
	const getFavourites = async () => {
		var userRef = await firebase
			.firestore()
			.collection('users')
			.doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					setLocalFavourites(doc.data().favourites);
				} else {
					console.log('No favourites!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

	// remove a favourite from a user's collection of all favourites
	const deleteFavourite = (aTitle) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter( //TODO delete favourite by some doc ID? or by crimes?
							(favourite) => favourite.title !== aTitle //TODO check how favs are deleted - needs to be unique so as not to delete several
						);
					//update firestore doc with the filtered favourites
					userRef.update({
						favourites: favouritesToKeep,
					});

					console.log(
						'Argument returned after deleting by mapURL: ' +
							favouritesToKeep
					);
					//update favourites state
					setLocalFavourites(favouritesToKeep);
				} else {
					console.log('No favourites!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

	return (
		<Container>
			<Container>
				{localFavourites.length ? (
					<Container id="favouritesContainer">
						<br />
						<h3>
							You have {localFavourites.length}
							{localFavourites.length > 1
								? ' favourites'
								: ' favourite'}
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
									deleteFavourite={deleteFavourite}
									displayMap={displayMap}
								/>
							))}
						</CardDeck>
					</Container>
				) : (
					<div>
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

