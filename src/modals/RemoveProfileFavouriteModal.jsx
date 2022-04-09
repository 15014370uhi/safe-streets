import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { deleteUserFavourite } from "../firebase";

const RemoveProfileFavouriteModal = (props) => {
		
	const deleteFavourite = async () => {		
		await deleteUserFavourite(props.timestamp);	
		props.updateUserFavourites();	
		props.onHide(); // hide modal interface
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
					onClick={() => deleteFavourite()}>
					Delete Favourite
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RemoveProfileFavouriteModal;