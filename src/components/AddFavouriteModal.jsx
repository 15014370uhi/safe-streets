import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {addUserFavourite} from '../firebase';

//style components
import {MDBInput} from 'mdbreact';

const AddFavouriteModal = (props) => {
	const [title, setTitle] = useState(''); //TODO check for cross site scripting

	//function which adds a new user favourite
	const createNewFavourite = async (e) => {


		// console.log(">>>>>>>>>>>>>>>>  createNewFavourite args: " 
		// + "Title: " + title + "\n"
		// + "props.mapdetails.mapurl: " + props.mapdetails.mapURL + "\n" 
		// + "props.mapdetails.locationname: " + props.mapdetails.locationname + "\n"
		// + "props.mapdetails.isnamesearch: " + props.mapdetails.isnamesearch + "\n"
		// + "props.mapdetails.lat: " + props.mapdetails.lat + "\n"
		// + "props.mapdetails.lon: " + props.mapdetails.lon + "\n"
		// + "props.mapdetails.numberofmonths: " + props.mapdetails.numberofmonths + "\n");


		//TODO fix
		props.onHide();
		try {				
			//await addUserFavourite(title, props.mapurl); 
			//await addUserFavourite(title, props.mapurl); 
			
			  await addUserFavourite(
			 	title, 
			  	props.mapdetails.mapURL,
			  	props.mapdetails.locationname,
			  	props.mapdetails.isnamesearch,
			  	props.mapdetails.lat,
			  	props.mapdetails.lon,
			  	props.mapdetails.numberofmonths
			  ); //TODO include all details in favourite 

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
		<Modal show={props.show} onHide={props.onHide} animation={false} size="lg" centered>
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
