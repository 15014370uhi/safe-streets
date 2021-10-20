import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { MapDetails } from "../contexts/MapDetailsContext";

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

const ShowDataModal = (props) => {
	const [mapDetails, setMapDetails] = useContext(MapDetails);

	//TODO need to display previous 12 months data - then show trends on graph over the Year
	//TODO calculate current month and set that to last - entry in graph -
	//TODO data points - dougnut with prediciton crimes - and trend of last 12 months actual


	//var data = [];
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


const getCrimeCategory = (aCrimeCategory) => {

	let crimeCat = '';

	switch (aCrimeCategory) {
    case 'Anti social behaviour':
		crimeCat = 'Anti-Social Behaviour';
      	break;	
		  
	case 'Bicycle theft':
	case 'Other theft':
	case 'Theft from the person':   
		crimeCat = 'Theft';
		break;	

	case 'Burglary':
		crimeCat = 'Burglary';
		break;

	case 'Criminal damage arson': 
		crimeCat = 'Criminal Damage & Arson';
		break;   
		
	case 'Drugs':
		crimeCat = 'Drugs';
		break;		
	
	case 'Public order':
	case 'Other crime':
		crimeCat = 'Public Order';
		break;
			
	case 'Possession of weapons':
		crimeCat = 'Possession of Weapons';
		break;

	case 'Violent crime':	
    case 'Robbery':
    case 'Violence and sexual offences':
		crimeCat = 'Violent Crime';
		break;

	case 'Vehicle crime':
		crimeCat = 'Vehicle Crime';
		break;

	case 'Shoplifting':
		crimeCat = 'Shoplifting';
		break;

	  default:
      //intentially blank
      break;
  }
  return crimeCat;
}

	var graphData = [
		{
			"name": "Jan",
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

		},
		{
			"name": "Feb",
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
		},
		{
			"name": "Mar",
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
		},
		{
			"name": "Apr", 
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
		},
		{
			"name": "May",
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
		},
		{
			"name": "Jun",
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
		},
		{
			"name": "Jul",
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
		},
		{
			"name": "Aug",
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
		},
		{
			"name": "Sep",
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
		},
		{
			"name": "Oct",
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
		},
		{
			"name": "Nov",
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
		},
		{
			"name": "Dec",
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
		},
	];


	//TODO TEST 
	//console.log('mapDetails context has historic data: ');
	//console.log(JSON.stringify(mapDetails.historicdata));

	for (const crime in mapDetails.historicdata) {
		let aCrimeRecord = mapDetails.historicdata[crime];

		// format crime category string
		var aCategory = aCrimeRecord.category.replace(/-/g," ");
		aCategory = aCategory.charAt(0).toUpperCase() + aCategory.slice(1);
		aCategory = getCrimeCategory(aCategory);	

		var aMonth = months[aCrimeRecord.month - 1];
		var year = aCrimeRecord.year;

		for (const [key, value] of Object.entries(graphData)) {
			//console.log(`${key}: ${value}`);
			//console.log(key + ' : ' + value.name);
			if (value.name === aMonth) {
				//console.log(value["Drugs"]);
				//console.log('value : ' + value.Drugs);
				//console.log('Check previous value: <<<<<<>>>>  ' + value[aCategory]);
				value[aCategory] = value[aCategory] + 1;
				//console.log('Check for incremented: >>>>  ' + value[aCategory]);
			}
		}		

		//TODO order graph by months since previous 12 months not jan to dec
		//TODO should end on previous 2nd month - and begin 12 months before that.
		//tODO get current month - 2, arrange data objects in order of that same order etc
		//TODO currently not showing predicitons ---------  need a modal for that maybe or add 
		//TODO to this modal by making it bigger?
		//tODO or allow for a search box for predicitons and show graph modal for that?
	}

	//console.log('graphData HOLDS: ' + JSON.stringify(graphData));

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
						Crime data for previous year
					</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ResponsiveContainer width={"99%"} height={400}>
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
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="Anti-Social Behaviour"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Area
							type="monotone"
							dataKey="Burglary"
							stackId="1"
							stroke="#82ca9d"
							fill="#82ca9d"
						/>
						<Area
							type="monotone"
							dataKey="Criminal Damage & Arson"
							stackId="1"
							stroke="#ffc658"
							fill="#ffc658"
						/>
						<Area
							type="monotone"
							dataKey="Drugs"
							stackId="1"
							stroke="red"
							fill="red"
						/>
						<Area
							type="monotone"
							dataKey="Possession of Weapons"
							stackId="1"
							stroke="#d0ed57"
							fill="#d0ed57"
						/>
						<Area
							type="monotone"
							dataKey="Public Order"
							stackId="1"
							stroke="#413ea0" //#ffc658
							fill="#413ea0"
						/>
						<Area
							type="monotone"
							dataKey="Shoplifting"
							stackId="1"
							stroke="blue"
							fill="blue"
						/>
						<Area
							type="monotone"
							dataKey="Theft"
							stackId="1"
							stroke="#a4de6c"
							fill="#a4de6c"
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
							stroke="#82ca9d"
							fill="#82ca9d"
						/>						
					</AreaChart>
				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};

export default ShowDataModal;
