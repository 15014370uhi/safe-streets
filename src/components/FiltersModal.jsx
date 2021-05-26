import React, {useState, useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import {MapDetails} from '.././contexts/MapDetailsContext';
import Button from 'react-bootstrap/Button';
import ButtonFilterCrime from './ButtonFilterCrime';
import uuid from 'react-uuid';
import {getUpdatedMapURL} from './../util/GetMapURL';

//array to hold crimes to remove from map display
let filters = []; //TODO TEST outside of scope

const FiltersModal = (props) => {	

	//filter buttons
	const [crimeButtons, setCrimeButtons] = useState([
		{
			label: 'Anti-Social Behaviour', //button label text
			categories: ['anti-social-behaviour'], //element categories[0] used as button id
			isActive: true, //boolean flag to determine whether to display this crime on map
		},
		{
			label: 'Arson',
			categories: ['criminal-damage-arson'],
			isActive: true,
		},
		{
			label: 'Burglary',
			categories: ['burglary'],
			isActive: true,
		},
		{
			label: 'Drugs',
			categories: ['drugs'],
			isActive: true,
		},
		{
			label: 'Property Theft',
			categories: ['other-theft', 'bicycle-theft'],
			isActive: true,
		},
		{
			label: 'Public Order',
			categories: ['public-order', 'other-crime'],
			isActive: true,
		},
		{
			label: 'Robbery',
			categories: ['robbery'],
			isActive: true,
		},
		{
			label: 'Shoplifting',
			categories: ['shoplifting'],
			isActive: true,
		},
		{
			label: 'Vehicle Crime',
			categories: ['vehicle-crime'],
			isActive: true,
		},
		{
			label: 'Violent Crime',
			categories: ['violent-crime', 'theft-from-the-person'],
			isActive: true,
		},
		{
			label: 'Weapons',
			categories: ['possession-of-weapons'],
			isActive: true,
		},
	]);

	const [mapDetails, setMapDetails] = useContext(MapDetails);

	//function to handle user form input
	const changeFilterState = (label) => {
		const indexOfButtonToUpdate = crimeButtons.findIndex(
			(aButton) => aButton.label === label
		);
		const updatedButtons = [...crimeButtons]; //create copy of array

		let newIsActiveStatus = !updatedButtons[indexOfButtonToUpdate].isActive;
		updatedButtons[indexOfButtonToUpdate].isActive = newIsActiveStatus;
		let categories = updatedButtons[indexOfButtonToUpdate].categories;

		//if button is now active, remove crime categories from filtered crimes list
		if (newIsActiveStatus) {
			for (let category of updatedButtons[indexOfButtonToUpdate]
				.categories) {
				filters = filters.filter(
					(crimeFilter) => crimeFilter !== category
				);
			}
		} else {
			//else add crime categories to list of crimes to filter
			for (let category of categories) {
				filters.push(category);
			}
		}
		//update set of buttons with new state
		setCrimeButtons(updatedButtons);
	};

	const applyFilters = async () => {
		props.onHide(); //hide filter modal interface

		//TODO TEST data
		// // console.log("TESTING DATA APPLYFILTERS---------------" 
		// // + "\nlocationname:" + mapDetails.locationname
		// // 	+ "\nisnamesearch: " + mapDetails.isnamesearch
		// // 	+ "\nlat: " + mapDetails.lat
		// // 	+ "\nlon: " + mapDetails.lon
		// // 	+ "\nnumberofmonths: " + mapDetails.numberofmonths
		// // 	+ "\nfilters: " + filters);



		// const payload = {
		// 	locationname: mapDetails.locationname, //TODO ERROR with details
		// 	isnamesearch: mapDetails.isnamesearch,
		// 	lat: mapDetails.lat,
		// 	lon: mapDetails.lon,
		// 	numberofmonths: mapDetails.numberofmonths,
		// 	filters: filters,
		// };

		// console.log("Payload in FILTERSMODAL SENT to getUpdatedMapURL---->>>>>>>>>>>>>>>>>>>>>>-" 
		// + "\nlocationname:" + mapDetails.locationname
		// 	+ "\nisnamesearch: " + mapDetails.isnamesearch
		// 	+ "\nlat: " + mapDetails.lat
		// 	+ "\nlon: " + mapDetails.lon
		// 	+ "\nnumberofmonths: " + mapDetails.numberofmonths
		// 	+ "\nfilters: " + filters);

		//call API function in external file
		
		
		//const responseObject = await getUpdatedMapURL(payload); //PREVIOUS 
		props.updateMapURL(filters);


		// console.log(
		// 	'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' +
		// 		'\nlatitude: ' +
		// 		responseObject.latitude +
		// 		'\nlongitude: ' +
		// 		responseObject.longitude +
		// 		'\nisNameSearch: ' +
		// 		responseObject.isNameSearch +
		// 		'\nnumberOfMonths' +
		// 		responseObject.numberOfMonths +
		// 		'\nmapurl: ' +
		// 		responseObject.mapurl +
		// 		'\nfilters: ' +
		// 		responseObject.filters +
		// 		'\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
		// );

		// setMapDetails((prevState) => ({ //TODO may be cause of error PREVIOUS
		// 	mapURL: responseObject.mapurl,
		// 	...prevState.isnameSearch,
		// 	...prevState.lat,
		// 	...prevState.lon,
		// 	...prevState.numberOfMonths,
		// 	filters: filters,
		// }));
	};

	const resetFilters = () => { //TODO causes breaking of map
		filters = [];
		//const resetButtons = [...crimeButtons]; //create copy of buttons array

		for (let aButton of crimeButtons) {
			aButton.isActive = true; 
		}
		//setCrimeButtons(resetButtons);
		//props.onHide();
		applyFilters();
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
					Crime Filters
				</Modal.Title>
			</Modal.Header>

			<Modal.Body className="filterButtonsGroup">
				{crimeButtons.map((aButton) => (
					<ButtonFilterCrime
						key={uuid()}
						id={aButton.categories[0]}
						label={aButton.label}
						categories={aButton.categories}
						isActive={aButton.isActive}
						changeFilterState={changeFilterState}
					/>
				))}
			</Modal.Body>
			<Modal.Footer>
				<Button
					className="btn-footer"
					variant="red"
					onClick={resetFilters}>
					Reset
				</Button>
				<Button
					className="btn-footer"
					variant="green"
					type="submit"
					onClick={() => applyFilters()}>
					Apply Filters
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FiltersModal;
