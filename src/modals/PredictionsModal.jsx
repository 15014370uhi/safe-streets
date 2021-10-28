import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ResultsData } from '../contexts/ResultsDataContext';


const ShowPredictionsModal = (props) => {
	const [resultsData, setResultsData] = useContext(ResultsData);



	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			animation={false}
			size="lg"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<h3 className="my-3">						
						Predicted Crime rates
					</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				

			</Modal.Body>
		</Modal>
	);
};

export default ShowPredictionsModal;
