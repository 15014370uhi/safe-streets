import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import firebase from "firebase";
import {testDeleteFavourite} from '../firebase';
import { useHistory } from "react-router-dom";
import { UserContext } from "../auth/UserProvider";

const RemoveFavouriteModal = (props) => {
	const user = useContext(UserContext); // Get User Context for ID
	let history = useHistory();


	const testDeleteFav = async (aTimestamp) => {
		console.log('testDeleteFavourite: ' + aTimestamp);
		var favouritesReturned = await testDeleteFavourite(aTimestamp);
		console.log('Favourites returned: ' + JSON.stringify(favouritesReturned));
		props.onHide(); //hide modal interface
	};



	// function to remove a favourite from a user's collection of favourites based on title
	const deleteFavourite = async (aTimestamp) => {
		var userRef = firebase.firestore().collection("users").doc(user.uid);
		await userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter(
							(favourite) => favourite.timestamp !== aTimestamp
						);
					//update firestore user document with the favourites
					userRef.update({
						favourites: favouritesToKeep,
					});

					//redirect to favourites page
					//let path = `/favourites`; //TODO
					//history.push(path);
					//TODO favourite not deleting
					//TEST
					props.onHide(); //hide modal interface
				} else {
					console.log("No favourites!");
				}
			})
			.catch(function (error) {
				console.log("Error getting favourites:", error);
			});
	};

	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			animation={false}
			size="lg"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Are you sure you want to delete this favourite?
				</Modal.Title>
			</Modal.Header>
			<Modal.Footer>
				<Button variant="green" onClick={props.onHide}>
					Cancel
				</Button>
				<Button
					variant="red"
					type="submit"
					onClick={() => testDeleteFav(props.timestamp)}>
					Delete Favourite
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RemoveFavouriteModal;
