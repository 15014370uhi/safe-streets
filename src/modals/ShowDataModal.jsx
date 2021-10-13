import React, {useContext} from "react";
import Modal from 'react-bootstrap/Modal';
import { MapDetails } from "../contexts/MapDetailsContext";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

//style components
import {MDBIcon} from 'mdbreact';

const ShowDataModal = props => { 
  
  const [mapDetails, setMapDetails] = useContext(MapDetails); 

  //const anti_social_behaviour = parseFloat (flaskdata.Anti_social_behaviour / 4).toFixed (2); //WEEKLY?
  //console.log('TEST VALUES:: ' + mapDetails.flaskdata.Burglary);


  // const anti_social_behaviour = parseFloat (flaskdata.Anti_social_behaviour).toFixed (2); //WEEKLY or not?
  // const burglary = parseFloat (flaskdata.Burglary).toFixed (2);
  // const criminal_damage_and_arson = parseFloat (flaskdata.Criminal_damage_and_arson).toFixed (2);
  // const drugs = parseFloat (flaskdata.Drugs).toFixed (2);
  // const possession_of_weapons = parseFloat (flaskdata.Possession_of_weapons).toFixed (2);
  // const public_order = parseFloat (flaskdata.Public_order).toFixed (2);
  // const theft = parseFloat (flaskdata.Theft).toFixed (2);
  // const vehicle_crime = parseFloat (flaskdata.Vehicle_crime).toFixed (2);
  // const violent_crime = parseFloat (flaskdata.Violent_crime).toFixed (2);	  

  const anti_social_behaviour = Math.round(mapDetails.flaskdata.Anti_social_behaviour); //WEEKLY or not?
  const burglary = Math.round(mapDetails.flaskdata.Burglary);
  const criminal_damage_and_arson = Math.round(mapDetails.flaskdata.Criminal_damage_and_arson);
  const drugs = Math.round(mapDetails.flaskdata.Drugs);
  const possession_of_weapons = Math.round(mapDetails.flaskdata.Possession_of_weapons);
  const public_order = Math.round(mapDetails.flaskdata.Public_order);
  const theft = Math.round(mapDetails.flaskdata.Theft);
  const vehicle_crime = Math.round(mapDetails.flaskdata.Vehicle_crime);
  const violent_crime = Math.round(mapDetails.flaskdata.Violent_crime);	  


  //TODO need to display previous 12 months data - then show trends on graph over the Year
  // Maybe add new bit on end of graph for prediction?
  //need months, crimes, and total crimes for each type of crime
  //calculate current month and set that to last - entry in graph - 
  
  //Two data points - dougnut with prediciton crimes - and trend of last 12 months actual

  const data = [
    {
      'name': 'Jan',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Feb',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Mar',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Apr', //Was...   name: 'April'
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'May',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Jun',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Jul',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Aug',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Sep',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Oct',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Nov',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
    {
      'name': 'Dec',
      'Anti-Social': anti_social_behaviour,
      'Burglary': burglary,
      'Criminal Damage and Arson': criminal_damage_and_arson,
      'Drugs': drugs,
      'Possession of Weapons': possession_of_weapons,
      'Public Order': public_order,
      'Theft': theft,
      'Vehicle Crime': vehicle_crime,
      'Violent Crime': violent_crime,
    },
  ];
 

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      animation={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3 className="my-3">
            <MDBIcon className="addFavModal-icon" icon="bookmark" />
            Crime data for previous year
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>   
      <ResponsiveContainer width={'99%'} height={400}>
          <AreaChart
            width={400}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
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
