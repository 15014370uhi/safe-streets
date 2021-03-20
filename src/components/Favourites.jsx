import React, {useContext, useEffect, useState} from 'react';
import Favourite from './Favourite';
import {UserContext} from '../auth/UserProvider';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';
//import Button from 'react-bootstrap/Button';
import firebase from 'firebase';
import CardDeck from 'react-bootstrap/CardDeck';

// TODO favourites as cards on this screen - or combine profile and favourites into single page?
const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const user = useContext(UserContext); // Get User Context for ID

	// TODO TRY move the functions to the firebase - for favs etc
	// TODO REM - only use useContext Usercontext to get current user ID nothing else

	useEffect(() => {
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// TODO change functions to consts
	// TODO move getFavourites to firebase as a function
	// Function which retrieves the favourites for a user
	const getFavourites = async () => {
		var userRef = await firebase
			.firestore()
			.collection('users')
			.doc(user.uid);

		// TODO Previous working
		// const getFavourites = () => {
		// 	var userRef = firebase.firestore().collection('users').doc(user.uid);

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

	// Function to remove a favourite from a user's collection of favourites
	const deleteFavourite = (aTitle) => {
		//console.log('deleteFavourite function RUN for title: ');
		//console.log(aTitle);
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter(
							(favourite) => favourite.title !== aTitle
						);
					// Update firestore doc with the filtered favourites
					userRef.update({
						favourites: favouritesToKeep,
					});

					// Update favourites state
					setLocalFavourites(favouritesToKeep); // RETURN the favourites to keep then set here
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
			{localFavourites.length ? (
				<Container id="favouritesContainer">
					<br />
					<h3>
						You have {localFavourites.length}{' '}
						{localFavourites.length > 1
							? 'favourites'
							: 'favourite'}
					</h3>
					<CardDeck>
						{localFavourites.map((favourite) => (
							<Favourite
								key={uuid()}
								title={favourite.title}
								mapURL={favourite.mapURL}
								timestamp={favourite.timestamp}
								deleteFavourite={deleteFavourite}
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
	);
};

export default Favourites;

//TODO implement Favourite component to display favourite information
