import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	ReferenceLine,
} from "recharts";

//style components
import { MDBIcon } from "mdbreact";



const ShowPredictionsModal = (props) => {
	const [resultsData] = useContext(ResultsData);
	const predictions = resultsData.predictions;
	console.log(resultsData.predictions);


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
	console.log(months[predictedMonth]);
	
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
		case "Anti social behaviour":
			crimeCat = "Anti-Social Behaviour";
			break;

		case "Bicycle theft":
		case "Other theft":
		case "Theft from the person":
			crimeCat = "Theft";
			break;

		case "Burglary":
			crimeCat = "Burglary";
			break;

		case "Criminal damage arson":
			crimeCat = "Criminal Damage & Arson";
			break;

		case "Drugs":
			crimeCat = "Drugs";
			break;

		case "Public order":
		case "Other crime":
			crimeCat = "Public Order";
			break;

		case "Possession of weapons":
			crimeCat = "Possession of Weapons";
			break;

		case "Violent crime":
		case "Robbery":
		case "Violence and sexual offences":
			crimeCat = "Violent Crime";
			break;

		case "Vehicle crime":
			crimeCat = "Vehicle Crime";
			break;

		case "Shoplifting":
			crimeCat = "Shoplifting";
			break;

		default:
			//intentially blank
			break;
	}
	console.log('Crime Cat: ',crimeCat);
	return crimeCat;
};


	var currentMonth = getCurrentMonth();	
	var predictedMonth = getCurrentMonth();	
	const data = [{}];
	var counter = 0;

	for (const [key, value] of Object.entries(predictions)) {

		console.log(predictions[key] + ', ' + key);

		data.push({
			crime: getCrimeCategory(key), 			
			predictedMonth: predictions[key] + '%',
		});
	};

	
		


	// 	// format crime category string
	// 	var aCategory = aCrimeRecord.category.replace(/-/g, " ");
	// 	aCategory = aCategory.charAt(0).toUpperCase() + aCategory.slice(1);
	// 	aCategory = getCrimeCategory(aCategory);

	// 	// revert crime month to zero based index
	// 	var indexOfMonth = parseInt(aCrimeRecord.month - 1);
	// 	var aMonth = months[indexOfMonth];

	// 	for (const [key, value] of Object.entries(graphData)) {
	// 		// if current object matches month crime was committed
	// 		if (value.name === aMonth) {
	// 			// increment count of crime of this type for month
	// 			value[aCategory] = value[aCategory] + 1;
	// 		}
	// 	}
	// }


	// 	{
	// 		crime: resultsData.Anti_social_behaviour, currentMonth: 40, next_month: -40,
	// 	},
	// 	{
	// 		crime: resultsData.Burglary, currentMonth: 40, next_month: 24,
	// 	},
	// 	{
	// 		crime: resultsData.Criminal_damage_and_arson, currentMonth: 400, next_month: -340,
	// 	},
	// 	{
	// 		crime: resultsData.Drugs, currentMonth: 300, next_month: -640,
	// 	},
	// 	{
	// 		crime: resultsData.Possession_of_weapons, currentMonth: 80, next_month: 30,
	// 	},
	// 	{
	// 		crime: resultsData.Public_order, currentMonth: 340, next_month: 240,
	// 	},
	// 	{
	// 		crime: resultsData.Theft, currentMonth: 200, next_month: 240,
	// 	},
	// 	{
	// 		crime: resultsData.Shoplifting, currentMonth: 300, next_month: 240,
	// 	},
	// 	{
	// 		crime: resultsData.Vehicle_crime, currentMonth: 100, next_month: -40,
	// 	},
	// 	{
	// 		crime: resultsData.Violent_crime, currentMonth: 40, next_month: -240,
	// 	},
	
	// 	// {
	// 	// 	name: 'Page G', uv: 3490, pv: -4300, amt: 2100,
	// 	// },
	// ];




	// 	//TODO TEST
	// 	const predictionData = resultsData.predictions;
	// //	console.log(predictionData);//

	// 	// //TODO TEST display of flask dataKey
	// 	const anti_social_behaviour = predictionData.Anti_social_behaviour;
	// 	const burglary = predictionData.Burglary;
	// 	const criminal_damage_and_arson =
	// 	predictionData.Criminal_damage_and_arson;
	// 	const drugs = predictionData.Drugs;
	// 	const possession_of_weapons = predictionData.Possession_of_weapons;
	// 	const public_order = predictionData.Public_order;
	// 	const theft = predictionData.Theft;
	// 	const shoplifting = predictionData.Shoplifting;
	// 	const vehicle_crime = predictionData.Vehicle_crime;
	// 	const violent_crime = predictionData.Violent_crime;

		// //TODO Convert to graphic data within modal for prediction and historic data
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
	






	//TODO OLD




	// function which returns an array of months sorted in order of how
	// they should be displayed on a graph of historic crimes
	const getSortedMonths = () => {
		var sortedMonths = [];

		//get final graph month to display
		let finalGraphMonth = new Date().getMonth() + 1; //zero indexed

		if (finalGraphMonth === 1) {
			// January special case
			finalGraphMonth = 11; // set month to (2 months prior)
		} else if (finalGraphMonth === 2) {
			// February special case
			finalGraphMonth = 12; // set crime month to December (2 months prior)
		} else {
			// else decrement month by 2
			finalGraphMonth = finalGraphMonth - 2;
		}

		// get first graph month
		var currentGraphMonth = finalGraphMonth + 1;

		// create new crime stats month object and add to array
		for (var i = 0; i < 12; i++) {
			if (currentGraphMonth > 12) {
				currentGraphMonth = currentGraphMonth - 12;
			}

			var monthlyStats = {
				name: months[currentGraphMonth - 1],
				"Anti-Social Behaviour": 0,
				Burglary: 0,
				"Criminal Damage & Arson": 0,
				Drugs: 0,
				"Public Order": 0,
				"Possession of Weapons": 0,
				Shoplifting: 0,
				Theft: 0,
				"Vehicle Crime": 0,
				"Violent Crime": 0,
			};
			sortedMonths.push(monthlyStats);
			currentGraphMonth++;
		}

		return sortedMonths;
	};

	
	var graphData = getSortedMonths();

	for (const crime in resultsData.historicdata) {
		let aCrimeRecord = resultsData.historicdata[crime];

		// format crime category string
		var aCategory = aCrimeRecord.category.replace(/-/g, " ");
		aCategory = aCategory.charAt(0).toUpperCase() + aCategory.slice(1);
		aCategory = getCrimeCategory(aCategory);

		// revert crime month to zero based index
		var indexOfMonth = parseInt(aCrimeRecord.month - 1);
		var aMonth = months[indexOfMonth];

		for (const [key, value] of Object.entries(graphData)) {
			// if current object matches month crime was committed
			if (value.name === aMonth) {
				// increment count of crime of this type for month
				value[aCategory] = value[aCategory] + 1;
			}
		}
	};



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


				<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5, right: 30, left: 20, bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="crime" />
				<YAxis />
				<Tooltip />
				<Legend />
				<ReferenceLine y={0} stroke="#000" />
				<Bar dataKey={getCurrentMonth} fill="#8884d8" />
				<Bar dataKey={getPredictedMonth} fill="#82ca9d" />
			</BarChart>


				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};

export default ShowPredictionsModal;
