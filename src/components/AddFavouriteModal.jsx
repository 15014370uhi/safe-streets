import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {addUserFavourite} from '../firebase';
import {useHistory} from 'react-router-dom';

//style components
import {MDBInput} from 'mdbreact';

const AddFavouriteModal = (props) => {
	const [title, setTitle] = useState('');
	const history = useHistory();

	//function which adds a new user favourite
	const createNewFavourite = async (e) => {
		props.onHide();

		try {
			await addUserFavourite(
				//TODO may need to fill in default values for undefined
				title,
				props.mapdetails.mapURL,
				props.mapdetails.locationname,
				props.mapdetails.isnamesearch,
				props.mapdetails.lat,
				props.mapdetails.lon,
				props.mapdetails.numberofmonths,
				props.mapdetails.filters
			);

			//change mapdisplay icon from add fav to remove fav
			history.push(`/results`, {
				isfavourite: 'true', //boolean flag to determine if map a previously favourited map or new search result
			}); //flag current map as a favourite
		} catch (error) {
			console.log('Error adding favourite' + error);
		}
	};

	//function to handle user form input
	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		//if title input, set title state
		if (name === 'title') {
			setTitle(value);
		}
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
					Add New Favourite Location
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<div className="grey-text">
					<MDBInput
						required
						label="Add a title..."
						size="lg"
						group
						type="text"
						name="title"
						validate
						error="wrong"
						success="right"
						value={title}
						onChange={(e) => onChangeHandler(e)}
					/>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="red" onClick={props.onHide}>
					Cancel
				</Button>
				<Button
					variant="green"
					type="submit"
					onClick={() => createNewFavourite()}>
					Save Favourite
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddFavouriteModal;
