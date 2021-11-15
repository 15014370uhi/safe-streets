import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import { populateCrimes } from "../util/GetCrimeData";
import FadeIn from "react-fade-in";
import uuid from "react-uuid";

//style components
import { MDBIcon } from "mdbreact";

const CrimeWarningModal = (props) => {
	const [resultsData, setResultsData] = useContext(ResultsData);

	const displayCrimes = populateCrimes(resultsData.predictions);

	const getIncidentText = (occurences) => {
		var text = "incident";

		if (occurences > 1) {
			text = "incidents";
		}

		return text;
	};
	// function which returns the correct threat message for each level
	const getThreatMessage = (aThreatLevel) => {
		var message;

		switch (aThreatLevel) {
			case "High":
				message = "Risk of violence";
				break;

			case "Medium":
				message = "Risk to property or possessions";
				break;

			case "Low":
				message = "Risk of noise and distruption";
				break;

			default:
				//intentially blank
				break;
		}
		return message;
	};

	return (
		<Modal
			animation={false}
			dialogClassName="modal-dialog modal-xl"
			show={props.show}
			onHide={props.onHide}
			centered>
			<Modal.Header closeButton>
				<Modal.Title 
				id="contained-modal-title-vcenter">						
					<p className="my-3 prediction-modal-heading">
						<MDBIcon
							className="crime-warnings-icon"
							icon="fa fa-exclamation fa-lg"
						/>
						Predicted Threat Level: {resultsData.threatLevel}
						<span className="risk-title-declaration">
							{" "}
							({getThreatMessage(resultsData.threatLevel)}){" "}
						</span>
					</p>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FadeIn delay={100}>
					<Modal.Body>
						<Modal.Title id="contained-modal-title-vcenter">
							<p className="threat-list-titles">
								Most Prolific Predicted Crimes
							</p>
						</Modal.Title>
						{displayCrimes.slice(0, 2).map((aCrime) => (
							<p className="crime-warning-top" key={uuid()}>
								<strong>{aCrime.crime}: </strong>
								{aCrime.occurrences}{" "}
								{getIncidentText(aCrime.occurrences)}
								<span className="percentages-top-crimes">
									({aCrime.percentage}% of crimes)
								</span>
							</p>
						))}
					</Modal.Body>
					<Modal.Body>
						<Modal.Title id="contained-modal-title-vcenter">
							<p className="threat-list-titles">
								Other Predicted Crimes
							</p>
						</Modal.Title>
						{displayCrimes.slice(2).map((aCrime) => (
							<p className="crime-warning-other" key={uuid()}>
								{aCrime.crime}: {aCrime.occurrences}{" "}
								{getIncidentText(aCrime.occurrences)}
								<span className="percentages-other-crimes">
									({aCrime.percentage}% of crimes)
								</span>
							</p>
						))}
					</Modal.Body>
				</FadeIn>
			</Modal.Body>
		</Modal>
	);
};

export default CrimeWarningModal;
