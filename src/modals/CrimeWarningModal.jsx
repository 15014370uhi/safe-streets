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

	var threats;	

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

	
	// Function which sorts an array of crimes by percentage value
	const sortCrimesByPercentage = (crimeArray) => {
		// sort crimes by lowest to highest percentage
		crimeArray.sort(function (crimeA, crimeB) {
			return crimeA.percentage - crimeB.percentage;
		});

		// reverse order
		crimeArray.reverse();
		console.log("crimeArray: " + JSON.stringify(crimeArray));
		return crimeArray;
	};


	// Function which populates an array with formatted crime predictions
	const populateCrimes = (crimes) => {
		var results = [];

		for (var crime in crimes.percentages) {
			var crimeCategory = getCrimeCategory(crime);
			var crimeOccurence = parseInt(
				crimes.totals[crime]
			);
			var percentageOfCrimes = parseFloat(
				crimes.percentages[crime]
			);

			var crimeData = {
				crime: crimeCategory,
				occurrences: crimeOccurence,
				percentage: percentageOfCrimes,
				//percentage: percentageOfCrimes + "%",
			};
			results.push(crimeData);
		}

		// sort crime order by percentage
		results = sortCrimesByPercentage(results);

		return results;
	};


	// Function which finds the most prolific crimes from an array of crimes
	const getThreats = (crimes) => {

		// get top 3 crimes... is highest violent etc? if 2/3 top crimes are on the 
		// vilolent list - set threat high, etc

		

		//tODO find some way to decide which are threats - e.g. violent etc is high threat
		for(var aCrime in crimes){
			console.log(aCrime); 
		}
		return crimes;
	};

	if (resultsData.predictions) {
		threats = populateCrimes(resultsData.predictions);

		// call function to find most prolific crimes
		//threats = getThreats(threats);
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
					<strong>Predicted Crime Incidents</strong>
				</p>
				{threats.map((aCrime) => (
					<p className="crime-warning-item" key={uuid()}>
						<strong>
							{aCrime.crime}: {aCrime.occurrences}{" "}
						</strong>
						({aCrime.percentage}% of all crimes)
					</p>
				))}
			</Modal.Body>
		</Modal>
	);
};

export default CrimeWarningModal;
