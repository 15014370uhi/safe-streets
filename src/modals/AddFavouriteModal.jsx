import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { addUserFavourite } from "../firebase";
import { useHistory } from "react-router-dom";

// style components
import { MDBInput, MDBIcon } from "mdbreact";

const AddFavouriteModal = (props) => {
	const [title, setTitle] = useState("");
	const [charCount, setCharCount] = useState(50);
	const history = useHistory();

	// function which adds a new user favourite
	const createNewFavourite = async (e) => {
		props.onHide();

		try {
			await addUserFavourite(
				title,
				props.mapdetails.allCrimes,
				props.mapdetails.locationName,
				props.mapdetails.lat,
				props.mapdetails.lon,
				props.mapdetails.filters
			);

			// change icon from add fav + to remove fav -
			history.push(`/mapdisplay`, {
				isfavourite: "true", // if was a previously favourited map
			});
		} catch (error) {
			console.log("Error adding favourite" + error);
		}
	};

	// function to handle user form input
	const onChangeHandler = (e) => {
		const { name, value } = e.currentTarget;
		// if title input, set title state
		if (name === "title") {
			setTitle(value);
			setCharCount(42 - value.length);
		}
	};

	return (
		<Modal
			animation={false}
			show={props.show}
			onHide={props.onHide}			
			size="lg"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<h3 className="my-3">
						<MDBIcon className="addFavModal-icon" icon="bookmark" />
						Add New Favourite
					</h3>
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<div className="grey-text">
					<MDBInput
						className="favourite-input-title"
						required
						label="Enter a title..."
						maxLength="42"
						background
						size="lg"
						autoFocus
						group
						type="text"
						name="title"
						validate
						error="wrong"
						success="right"
						value={title}
						onChange={(e) => onChangeHandler(e)}
					/>
					<label>({charCount} Characters Remaining)</label>
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
