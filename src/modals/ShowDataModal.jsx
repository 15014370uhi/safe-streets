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

  //TODO crime data needs months data in it - so I can create the graph using months

	// //const anti_social_behaviour = parseFloat (flaskdata.Anti_social_behaviour / 4).toFixed (2); //WEEKLY?
	// //console.log('TEST VALUES:: ' + mapDetails.flaskdata.Burglary);

	// var allCrimeCategories = {
	// 	// anti_social_behaviour: 0,
	// 	// Burglary: 0,
	// 	// Criminal_damage_and_arson: 0,
	// 	// Drugs: 0,
	// 	// Possession_of_weapons: 0,
	// 	// Public_order: 0,
	// 	// Theft: 0,
	// 	// Vehicle_crime: 0,
	// 	// Violent_crime: 0,
	// };

	// //TODO check if values exist
	// var anti_social_behaviour = 0;
	// var burglary = 0;
	// var criminal_damage_and_arson = 0;
	// var drugs = 0;
	// var possession_of_weapons = 0;
	// var public_order = 0;
	// var theft = 0;
	// var vehicle_crime = 0;
	// var violent_crime = 0;

	// for (const crimeCategory in mapDetails.flaskdata) {
	// 	let crimeValue = mapDetails.flaskdata[crimeCategory];
	// 	if (crimeValue > 0) {
	// 		allCrimeCategories.crimeCategory = Math.round(crimeValue);
	// 	} else {
  //     delete allCrimeCategories.crimeCategory; //remove invalid element
  //   }
	// }

  // console.log('allCrimeCategories:' + JSON.stringify (allCrimeCategories));
   
  // using spread ...
  //let p1 = {
     // ...person
  //};

	// const anti_social_behaviour = Math.round(mapDetails.flaskdata.Anti_social_behaviour); //WEEKLY or not?
	// const burglary = Math.round(mapDetails.flaskdata.Burglary);
	// const criminal_damage_and_arson = Math.round(mapDetails.flaskdata.Criminal_damage_and_arson);
	// const drugs = Math.round(mapDetails.flaskdata.Drugs);
	// const possession_of_weapons = Math.round(mapDetails.flaskdata.Possession_of_weapons);
	// const public_order = Math.round(mapDetails.flaskdata.Public_order);
	// const theft = Math.round(mapDetails.flaskdata.Theft);
	// const vehicle_crime = Math.round(mapDetails.flaskdata.Vehicle_crime);
	// const violent_crime = Math.round(mapDetails.flaskdata.Violent_crime);

	//TODO need to display previous 12 months data - then show trends on graph over the Year
	// Maybe add new bit on end of graph for prediction?
	//need months, crimes, and total crimes for each type of crime
	//calculate current month and set that to last - entry in graph -

	//Two data points - dougnut with prediciton crimes - and trend of last 12 months actual

  //TODO hold array of jan to dec - in order of data? - then add name:Jan, then iterate over datathrough
  // alcrime categories and add new object element based on each
  var historicTEST = JSON.stringify(mapDetails.historicdata);
  
  // for (var element in historicTEST) {
  //   console.log(element);
  // }
  //console.log('map details historic holds: ' + JSON.stringify(mapDetails.historicdata));


  var data = [];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  var counter = 0;

	for (const crimeCategory in mapDetails.flaskdata) {
    
    var dataElement = {
      "name": months[counter],
    }   

		let crimeValue = mapDetails.flaskdata[crimeCategory]; //should be using historic data
    //TODO need a data check somewhere once I have months in data 

		if (crimeValue > 0) {
			dataElement[crimeCategory] = Math.round(crimeValue);
      data.push(dataElement);
      counter ++;
		}
	}
  
  console.log('DATA HOLDS: ' + JSON.stringify(data));


	// const data = [
  //   {
	// 		"name": "TEST",
	// 		"Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Jan",
	// 		"Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Feb",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Mar",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Apr", //Was...   name: 'April'
	// 		"Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "May",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Jul",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Aug",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Sep",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Oct",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Nov",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// 	{
	// 		name: "Dec",
  //     "Anti-Social": anti_social_behaviour,
	// 		"Burglary": burglary,
	// 		"Criminal Damage and Arson": criminal_damage_and_arson,
	// 		"Drugs": drugs,
	// 		"Possession of Weapons": possession_of_weapons,
	// 		"Public Order": public_order,
	// 		"Theft": theft,
	// 		"Vehicle Crime": vehicle_crime,
	// 		"Violent Crime": violent_crime,
	// 	},
	// ];

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
						width={400}
						height={400}
						data={data}
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
							dataKey="Anti-Social"
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
							dataKey="Criminal Damage and Arson"
							stackId="1"
							stroke="#ffc658"
							fill="#ffc658"
						/>
						<Area
							type="monotone"
							dataKey="Drugs"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Area
							type="monotone"
							dataKey="Possession of Weapons"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Area
							type="monotone"
							dataKey="Public Order"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Area
							type="monotone"
							dataKey="Theft"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
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
							stroke="#8884d8"
							fill="#8884d8"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};

export default ShowDataModal;
