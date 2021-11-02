import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { ResultsData } from "../contexts/ResultsDataContext";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

//style components
import { MDBIcon } from "mdbreact";

const ShowHistoricCrimeModal = (props) => {
	const [resultsData] = useContext(ResultsData);

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
				"name": months[currentGraphMonth - 1],
				"Anti-Social Behaviour": 0,
				"Burglary": 0,
				"Criminal Damage & Arson": 0,
				"Drugs": 0,
				"Public Order": 0,
				"Possession of Weapons": 0,
				"Shoplifting": 0,
				"Theft": 0,
				"Vehicle Crime": 0,
				"Violent Crime": 0,
			};
			sortedMonths.push(monthlyStats);
			currentGraphMonth++;
		}

		return sortedMonths;
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
		return crimeCat;
	};

	var graphData = getSortedMonths();

	for (const crime in resultsData.historicCrimes) {
		let aCrimeRecord = resultsData.historicCrimes[crime];

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
	}

	return (
		<Modal
			dialogClassName="modal-dialog modal-xl"
			show={props.show}
			onHide={props.onHide}				
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<h3 className="my-3">
						<MDBIcon className="addFavModal-icon" icon="bookmark" />
						Crime occurences per month in this area
					</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ResponsiveContainer width={"100%"} height={600}>
					<AreaChart
						width={500}
						height={400}
						data={graphData}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis type="number" domain={['dataMin', 'dataMax']}/>
						<Tooltip />
						<Area
							type="monotone"
							dataKey="Anti-Social Behaviour"
							stackId="1"
							stroke="#8a0404"
							fill="#8a0404"
						/>
						<Area
							type="monotone"
							dataKey="Burglary"
							stackId="1"
							stroke="#493baf"
							fill="#493baf"
						/>
						<Area
							type="monotone"
							dataKey="Criminal Damage & Arson"
							stackId="1"
							stroke="orange"
							fill="orange"
						/>
						<Area
							type="monotone"
							dataKey="Drugs"
							stackId="1"
							stroke="brown"
							fill="brown"
						/>
						<Area
							type="monotone"
							dataKey="Possession of Weapons"
							stackId="1"
							stroke="red"
							fill="red"
						/>
						<Area
							type="monotone"
							dataKey="Public Order"
							stackId="1"
							stroke="#570345"
							fill="#570345"
						/>
						<Area
							type="monotone"
							dataKey="Shoplifting"
							stackId="1"
							stroke="orange"
							fill="orange"
						/>
						<Area
							type="monotone"
							dataKey="Theft"
							stackId="1"
							stroke="purple"
							fill="purple"
						/>
						<Area
							type="monotone"
							dataKey="Vehicle Crime"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Area
							type="monotone"
							dataKey="Violent Crime"
							stackId="1"
							stroke="#f40e0e"
							fill="#f40e0e"
						/>
					</AreaChart>
					
				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};

export default ShowHistoricCrimeModal;
