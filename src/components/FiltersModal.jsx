import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonFilterCrime from './ButtonFilterCrime';
import uuid from 'react-uuid';
import {getUpdatedMapURL} from './../util/GetMapURL';

//array to hold crimes to remove from map display
let filters = []; //TODO TEST outside of scope

const FiltersModal = (props) => {
	//full list of all police data API crime categories
	const [APICrimeCategories, setAPICrimeCategories] = useState([
		'anti-social-behaviour',
		'criminal-damage-arson',
		'public-order',
		'other-crime',
		'violent-crime',
		'theft-from-the-person',
		'possession-of-weapons',
		'shoplifting',
		'other-theft',
		'bicycle-theft',
		'vehicle-crime',
		'robbery',
		'drugs',
		'burglary',
	]);

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
				filters.push(category); //TODO might need loop to push
			}
		}
		//update set of buttons with new state
		setCrimeButtons(updatedButtons);

		//console.log("ALL filters created: " + filters);
		
		//TODO update map details context with filters - call API from external file - also include filters during api call
		// props.setmapdetails(prevState => ({
		// 	...prevState.mapURL,
		// 	...prevState.isnameSearch,
		// 	...prevState.lat,
		// 	...prevState.lon,
		// 	...prevState.numberOfMonths,
		// 	filters: filters,
		// }));

	};


	const applyFilters = async () => {
		props.onHide(); //hide filter modal

		 const payload = 
		 	{
		 		locationname: props.mapdetails.locationname,
		 		isnamesearch: props.mapdetails.isnamesearch,
		 		lat: props.mapdetails.lat,
		 		lon: props.mapdetails.lon,
		 		numberofmonths: props.mapdetails.numberofmonths,
		 		filters: filters,
		 	};		
		
			props.updateMapURL(payload);

//			const response = await getUpdatedMapURL(payload); //do this from mapdisplay?
//			//props.updateMapURL(filters);
		
			//console.log("Res in SEARCH.............." + response.mapurl);
			//TODO set map details with new url

		//TODO 1. call API with filters
		//TODO 2. update mapURL context
		//TODO 3. If needed - push history to map display - ensuring history props is favourite is correct

		//TODO option 1 - regex search and replace text from mapURL related to filters
		//TODO option 2 - make API call - might be better putting the function code
		//TODO for API call in parent component-mapDisplay - then calling it from here on
		//TODO apply filters button press - that way maybe some info I need to make API call
		//TODO will be in props and can be added to props	
	};



	const resetFilters = () => {
		props.onHide();

		//TODO reset filters list & button active/inactive state
		//TODO map over buttons state and set isACtive to true
	};

	//TODO MAKE filters here

	//TODO might be userful to update filters active state
	//TODO check old javascript from orignal version

	return (
		<Modal show={props.show} onHide={props.onHide} animation={false} size="lg" centered>
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
