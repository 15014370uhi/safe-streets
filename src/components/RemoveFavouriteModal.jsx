import React, {useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import firebase from 'firebase';
import {useHistory} from 'react-router-dom';
import {UserContext} from '../auth/UserProvider';

const RemoveFavouriteModal = (props) => {
	const user = useContext(UserContext); // Get User Context for ID
	let history = useHistory();

	//function to remove a favourite from a user's collection of favourites based on title
	const deleteFavourite = (aMapURL) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter( //TODO check if filter is best method of comparing string
							(favourite) => favourite.mapURL !== aMapURL
						);
					//update firestore doc with the filtered favourites
					userRef.update({
						favourites: favouritesToKeep,
					});

					//redirect to favourites page
					let path = `/favourites`; //TODO get path of calling page maybe as prop
					history.push(path);
				} else {
					console.log('No favourites!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

	return (
		<Modal show={props.show} onHide={props.onHide} animation={false} size="lg" centered>
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
					onClick={() => deleteFavourite(props.mapurl)}>
					Delete Favourite
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RemoveFavouriteModal;
