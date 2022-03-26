import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import FadeIn from "react-fade-in";

import {
	ResponsiveContainer,
	BarChart,
	Bar,
	LabelList,
	XAxis,
	YAxis,
	Cell,
} from "recharts";

//style components
import { MDBIcon } from "mdbreact";

const ShowPredictionsModal = (props) => {
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

	var aCurrentMonth = months[new Date().getMonth() + 1]; // compensate for zero indexed data

	// function which returns a crime category as graph label text
	const getCrimeCategory = (aCrimeCategory) => {
		let crimeCategory = "";

		//console.log('crime category received predictions modal: ' + aCrimeCategory);
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

	var chartData = [];

	// create graph data for each crime
	if (resultsData.predictions) {
		for (var crime in resultsData.predictions.totals) {
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

			chartData.push(crimeData);
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
							className="probabilityModal-icon"
							icon="fa fa-brain fa-lg"
						/>
						Number of crimes predicted for {aCurrentMonth}
					</h2>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FadeIn delay={250}>
					<ResponsiveContainer width={"100%"} height={500}>
						<BarChart
							data={chartData}
							layout="vertical"
							barCategoryGap={4}
							margin={{ top: 0, right: 65, left: 55, bottom: 0 }}>
							<XAxis type="number" hide />
							<YAxis
								type="category"
								width={220}
								dataKey="crime"
								tickMargin={10}
							/>

							<Bar
								dataKey="occurrences"
								fill={"blue"}
								animationDuration={2000}
								radius={[0, 8, 8, 0]}>
								<LabelList
									className="chart-labellist"
									dataKey="occurrences"
									position="right"
									style={{ fill: "black" }}
								/>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={crimeColours[index]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</FadeIn>
			</Modal.Body>
		</Modal>
	);
};

export default ShowPredictionsModal;
