import React, {useContext, useEffect, useState} from 'react';
import Favourite from './Favourite';
import {MapURL} from '.././contexts/MapContext';
import {MapDetails} from '.././contexts/MapDetailsContext';
import {UserContext} from '../auth/UserProvider';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';
import firebase from 'firebase';
import CardDeck from 'react-bootstrap/CardDeck';
import {useHistory} from 'react-router-dom';

const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const user = useContext(UserContext); //get User Context for ID
	const [mapURL, setMapURL] = useContext(MapURL); //mapURL context //TODO do i still need this context?
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const history = useHistory();

	useEffect(() => {
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//function which gets data for a single saved favourite
	const getFavourite = async (aMapURL) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		await userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const aFavourite = doc
						.data()
						.favourites.find(({mapURL}) => mapURL === aMapURL); 					
					updateMapURL(aFavourite);
				} else {
					console.log('No Matching favourite!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

	//updates the mapDetails context
	const updateMapURL = (aFavourite) => {	
		//update context to latest data 
		setMapDetails((mapDetails) => ({
			mapURL: aFavourite.mapURL,
			locationname: aFavourite.isnamesearch,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			numberofmonths: aFavourite.numberofmonths,
			filters: aFavourite.filters,
		}));
	};

	//display favourited map when clicked
	const displayMap = async (aMapURL) => {
		await getFavourite(aMapURL);		
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

	//remove a favourite from a user's collection of all favourites
	const deleteFavourite = (aMapURL) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter(
							(favourite) => favourite.mapURL !== aMapURL
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
									title={favourite.title}
									description={favourite.description}
									mapurl={favourite.mapURL}
									timestamp={favourite.timestamp}
									deleteFavourite={deleteFavourite}
									displayMap={displayMap}
								/>
							))}
						</CardDeck>
					</Container>
				) : (
					<div>
						<h1>No favourites found</h1>
					</div>
				)}
			</Container>
		</Container>
	);
};

export default Favourites;

//TODO implement Favourite component to display favourite information
