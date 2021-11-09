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
	// array of month names
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	var aCurrentMonth = months[new Date().getMonth() + 1];

	const getPredictedMonth = () => {
		//get final graph month to display
		let predictedMonth = new Date().getMonth() + 1; //zero indexed
		predictedMonth = months[predictedMonth];
		return predictedMonth;
	};

	const getCurrentMonth = () => {
		let currentMonth = new Date().getMonth() + 1; //zero indexed
		currentMonth = months[currentMonth];
		return currentMonth;
	};

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


	var highThreats = [];
	

	if (resultsData.predictions) {
		for (var index in resultsData.predictions) {
			var crimeCategory = getCrimeCategory(index);
			var percentage = parseFloat(resultsData.predictions[index]);
			
			var crimeData = {
				crime: crimeCategory,
				probability: percentage,
				label: percentage + "%",
			};
			
			if(percentage > 20){
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
					<h2 className="my-3 prediction-modal-heading">
						<MDBIcon
							className="crime-warnings-icon"
							icon="fa fa-exclamation fa-lg"
						/>
						High threat level for the following crimes..
					</h2>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>	
			{highThreats.map((aCrime) => (
				<p className="crime-warning-item"
				key={uuid()}>
				{aCrime.crime} {' '}						
				{aCrime.label}
				</p>)
				)}
			
			</Modal.Body>			
		</Modal>
	);
};

export default CrimeWarningModal;


// <FadeIn delay={150}>		
// 				<ResponsiveContainer width={"100%"} height={100}>			
// 									warning high threat
// 				</ResponsiveContainer>	
// 				<ResponsiveContainer width={"100%"} height={100}>			
// 									warning medium threat
// 				</ResponsiveContainer>	
// 				</FadeIn>		