import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";

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
	const [resultsData] = useContext(ResultsData);
	const predictions = resultsData.predictions; //TODO when loading favourite - get predictions manually
	const [crimeColours, setCrimeColours] = useState([
		"#8a0404", //anti-social-behaviour
		"purple", //theft
		"#493baf", //burglary
		"orange", //criminal_damage_and_arson
		"brown", //drugs
		"#570345", //public_order
		"red", //possession_of_weapons
		"#f40e0e", //violent_crime 
		"#8884d8", //vehicle_crime
		"orange", //shoplifting
	]); // chart colours

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

		//console.log("predictionMonth >>>>>>>>  : " + predictedMonth);
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

	const data = [];

	for (const [key, value] of Object.entries(predictions)) {
		var crimeCategory = getCrimeCategory(key);
		var percentage = parseFloat(predictions[key]);

		var dataToAdd = {
			crime: crimeCategory,
			probability: percentage,
			label: percentage + "%",
		};

		data.push(dataToAdd);
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
						Probability of crimes occuring during {aCurrentMonth}
					</h2>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ResponsiveContainer width={"99%"} height={500}>
					<BarChart
						data={data}
						layout="vertical"
						barCategoryGap={4}
						margin={{ top: 0, right: 65, left: 22, bottom: 0 }}>
						<XAxis type="number" hide />
						<YAxis
							type="category"
							width={220}
							dataKey="crime"
							tickMargin={10}
						/>
						<Bar
							dataKey="probability"
							fill={"blue"}
							animationDuration={900}
							radius={[0, 8, 8, 0]}>
							<LabelList
								className="chart-labellist"
								dataKey="label"
								position="right"
								style={{ fill: "black" }}
							/>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={crimeColours[index]}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};

export default ShowPredictionsModal;
