import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import FadeIn from "react-fade-in";
import uuid from "react-uuid";

import { ResponsiveContainer } from "recharts";

//style components
import { MDBIcon } from "mdbreact";

const CrimeWarningModal = (props) => {
	const [resultsData, setResultsData] = useContext(ResultsData);

	const [crimeColours, setCrimeColours] = useState([
		"darkslateblue", // anti-social-behaviour
		"hotpink", // burglary
		"orangered", // criminal_damage_and_arson
		"brown", // drugs
		"red", // possession_of_weapons
		"#570345", // public_order
		"olive", // robbery
		"gold", // shoplifting
		"blue", // theft
		"#8884d8", // vehicle_crime
		"black", // violent_crime
	]);

	const getCrimeCategory = (aCrimeCategory) => {
		let crimeCategory = "";
		switch (aCrimeCategory) {
			case "Anti-social behaviour":
				crimeCategory = "Anti-Social Behaviour";
				break;

			case "Burglary":
				crimeCategory = "Burglary";
				break;

			case "Criminal damage and arson":
				crimeCategory = "Criminal Damage & Arson";
				break;

			case "Drugs":
				crimeCategory = "Drugs";
				break;

			case "Possession of weapons":
				crimeCategory = "Possession of Weapons";
				break;

			case "Public order":
				crimeCategory = "Public Order";
				break;

			case "Robbery":
				crimeCategory = "Robbery";
				break;

			case "Shoplifting":
				crimeCategory = "Shoplifting";
				break;

			case "Theft":
				crimeCategory = "Theft";
				break;

			case "Vehicle crime":
				crimeCategory = "Vehicle Crime";
				break;

			case "Violent crime":
				crimeCategory = "Violent Crime";
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
			var crimeOccurence = parseInt(
				resultsData.predictions.totals[crime]
			);
			var percentageOfCrimes = parseFloat(
				resultsData.predictions.percentages[crime]
			);

			var crimeData = {
				crime: crimeCategory,
				occurrences: crimeOccurence,
				percentage: percentageOfCrimes + "%",
			};

			//TODO fix for classification of crimes violent, theft/property, nuiscence/noise(etc)
			if (percentageOfCrimes > 20) {
				highThreats.push(crimeData);
			}
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
				<p>
					<strong>
						Predicted Crime Incidents
					</strong>
				</p>
				{highThreats.map((aCrime) => (
					<p className="crime-warning-item" key={uuid()}>
						<strong>
							{aCrime.crime}: {aCrime.occurrences}{" "}
						</strong>
						({aCrime.percentage} of all crimes)
					</p>
				))}
			</Modal.Body>
		</Modal>
	);
};

export default CrimeWarningModal;
