import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import {
	ResponsiveContainer,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "recharts";

//style components
import { MDBIcon } from "mdbreact";

const ShowPredictionsModal = (props) => {
	const [resultsData] = useContext(ResultsData);
	const predictions = resultsData.predictions;

	// array of month names
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

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
		let crimeCat = "";
		switch (aCrimeCategory) {
			case "Anti_social_behaviour":
				crimeCat = "Anti-Social Behaviour";
				break;

			case "Theft":
				crimeCat = "Theft";
				break;

			case "Burglary":
				crimeCat = "Burglary";
				break;

			case "Criminal_damage_and_arson":
				crimeCat = "Criminal Damage & Arson";
				break;

			case "Drugs":
				crimeCat = "Drugs";
				break;

			case "Public_order":
				crimeCat = "Public Order";
				break;

			case "Possession_of_weapons":
				crimeCat = "Possession of Weapons";
				break;

			case "Violent_crime":
				crimeCat = "Violent Crime";
				break;

			case "Vehicle_crime":
				crimeCat = "Vehicle Crime";
				break;

			case "Shoplifting":
				crimeCat = "Shoplifting";
				break;

			default:
				//intentially blank
				break;
		}

		return crimeCat;
	};

	const data = [];

	for (const [key, value] of Object.entries(predictions)) {
		var crimeCategory = getCrimeCategory(key);
		var percentage = parseFloat(predictions[key]);

		//console.log(crimeCategory + " " + percentage);
		var dataToAdd = {
			crime: crimeCategory,
			probability: percentage,
		};

		data.push(dataToAdd);
	}

	//console.log("DATA ARRAY: " + JSON.stringify(data));

	//var graphData = populateData();

	// const predictionData = resultsData.predictions;
	// const anti_social_behaviour = predictionData.Anti_social_behaviour;
	// const burglary = predictionData.Burglary;
	// const criminal_damage_and_arson =
	// predictionData.Criminal_damage_and_arson;
	// const drugs = predictionData.Drugs;
	// const possession_of_weapons = predictionData.Possession_of_weapons;
	// const public_order = predictionData.Public_order;
	// const theft = predictionData.Theft;
	// const shoplifting = predictionData.Shoplifting;
	// const vehicle_crime = predictionData.Vehicle_crime;
	// const violent_crime = predictionData.Violent_crime;

	// alert(
	// 	"Predicted Crime Probabilities for this month: \n" +
	// 		"Anti-Social = " +
	// 		parseFloat(anti_social_behaviour).toFixed(2) +
	// 		"%\n" +
	// 		"Burglary = " +
	// 		parseFloat(burglary).toFixed(2) +
	// 		"%\n" +
	// 		"Criminal Damage & Arson = " +
	// 		parseFloat(criminal_damage_and_arson).toFixed(2) +
	// 		"%\n" +
	// 		"Drugs = " +
	// 		parseFloat(drugs).toFixed(2) +
	// 		"%\n" +
	// 		"Possession of Weapons = " +
	// 		parseFloat(possession_of_weapons).toFixed(2) +
	// 		"%\n" +
	// 		"Public Order = " +
	// 		parseFloat(public_order).toFixed(2) +
	// 		"%\n" +
	// 		"Theft = " +
	// 		parseFloat(theft).toFixed(2) +
	// 		"%\n" +
	// 		"Vehicle Crime = " +
	// 		parseFloat(vehicle_crime).toFixed(2) +
	// 		"%\n" +
	// 		"Violent Crime = " +
	// 		parseFloat(violent_crime).toFixed(2) +
	// 		"%\n" +
	// 		"Shoplifting = " +
	// 		parseFloat(shoplifting).toFixed(2) +
	// 		"%\n"
	// );

	

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
						<MDBIcon className="addFavModal-icon" icon="bookmark" />
						Probability of crimes for {getPredictedMonth}
					</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ResponsiveContainer width={"99%"} height={550}>
					<RadarChart cx="49%" cy="50%" outerRadius="75%" data={data}>
						<PolarGrid />
						<PolarAngleAxis dataKey="crime" />
						<PolarRadiusAxis />
						<Radar
							name="Mike"
							dataKey="probability"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.6}
						/>
					</RadarChart>
					
				</ResponsiveContainer>
				
			</Modal.Body>
		</Modal>
	);
};

export default ShowPredictionsModal;
