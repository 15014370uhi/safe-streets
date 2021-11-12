import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import FadeIn from "react-fade-in";
import uuid from "react-uuid";


import {
	ResponsiveContainer	
} from "recharts";

//style components
import { MDBIcon } from "mdbreact";

const CrimeWarningModal = (props) => {
	const [resultsData, setResultsData] = useContext(ResultsData);

	const [crimeColours, setCrimeColours] = useState([
		"darkslateblue", //anti-social-behaviour
		"blue", //theft
		"hotpink", //burglary
		"orangered", //criminal_damage_and_arson
		"brown", //drugs
		"#570345", //public_order
		"red", //possession_of_weapons
		"black", //violent_crime
		"#8884d8", //vehicle_crime
		"gold", //shoplifting
	]);


	const getCrimeCategory = (aCrimeCategory) => {
		let crimeCategory = "";
		switch (aCrimeCategory) {
			case "Anti_social_behaviour":
				crimeCategory = "Anti-Social Behaviour";
				break;

			case "Theft":
				crimeCategory = "Theft";
				break;

			case "Burglary":
				crimeCategory = "Burglary";
				break;

			case "Criminal_damage_and_arson":
				crimeCategory = "Criminal Damage & Arson";
				break;

			case "Drugs":
				crimeCategory = "Drugs";
				break;

			case "Public_order":
				crimeCategory = "Public Order";
				break;

			case "Possession_of_weapons":
				crimeCategory = "Possession of Weapons";
				break;

			case "Violent_crime":
				crimeCategory = "Violent Crime";
				break;

			case "Vehicle_crime":
				crimeCategory = "Vehicle Crime";
				break;

			case "Shoplifting":
				crimeCategory = "Shoplifting";
				break;

			default:
				//intentially blank
				break;
		}

		return crimeCategory;
	};

//TODO change all this to include crime types etc
	var highThreats = [];	

	if (resultsData.predictions) {
		for (var crime in resultsData.predictions.percentages) {
			var crimeCategory = getCrimeCategory(crime);
			var crimeOccurence = parseInt(resultsData.predictions.totals[crime]);
			var percentageOfCrimes = parseFloat(resultsData.predictions.percentages[crime]);
			
			var crimeData = {
				crime: crimeCategory,
				occurrences: crimeOccurence,				
				percentage: percentageOfCrimes + "%",
			};
			
			//TODO fix for classification of crimes violent, theft/property, nuiscence/noise(etc)
			if(percentageOfCrimes > 20){
				highThreats.push(crimeData);				
			};
	}
}


	return (
		<Modal
			animation={false}
			dialogClassName="modal-dialog modal-xl"
			show={props.show}
			onHide={props.onHide}
			centered>			
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<h3 className="my-3 prediction-modal-heading">
						<MDBIcon
							className="crime-warnings-icon"
							icon="fa fa-exclamation fa-lg"
						/>
						High threat levels for the following crimes...
					</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>	
			<p><strong><h2>Predicted Crime Incidents</h2></strong></p>		
			{highThreats.map((aCrime) => (
				<p className="crime-warning-item"
				key={uuid()}>
				<strong>				
				{aCrime.crime}: {' '}
				{aCrime.occurrences} {' '}		
				</strong>			
				({aCrime.percentage} of all crimes)
				</p>)
				)}
			
			</Modal.Body>			
		</Modal>
	);
};

export default CrimeWarningModal;

