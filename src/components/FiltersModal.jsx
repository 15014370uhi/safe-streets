import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonFilterCrime from './ButtonFilterCrime';
import uuid from 'react-uuid';

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

	//array to hold crimes to remove from map display
	const [APICrimesToHide, setAPICrimesToHide] = useState([]);

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
			label: 'Public Order',
			categories: ['public-order', 'other-crime'],
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
		{
			label: 'Shoplifting',
			categories: ['shoplifting'],
			isActive: true,
		},
		{
			label: 'Property Theft',
			categories: ['other-theft', 'bicycle-theft'],
			isActive: true,
		},
		{
			label: 'Vehicle Crime',
			categories: ['vehicle-crime'],
			isActive: true,
		},
		{
			label: 'Robbery',
			categories: ['robbery'],
			isActive: true,
		},
		{
			label: 'Drugs',
			categories: ['drugs'],
			isActive: true,
		},
		{
			label: 'Burglary',
			categories: ['burglary'],
			isActive: true,
		},
	]);

	//function to handle user form input
	const changeFilterState = (id, categories, isActive, label) => {
		//TODO find button from label
		//TODO add categories to list of categories to ignore from police data API
		console.log('id: ' + id);
		console.log('categories: ' + categories); //GET from array in this component
		console.log('isActive: ' + isActive);
		
			const indexOfButtonToUpdate = crimeButtons.findIndex((aButton) => aButton.label === label);
			const updatedButtons = [...crimeButtons]; //create copy of array
		
			updatedButtons[indexOfButtonToUpdate].isActive = !updatedButtons[indexOfButtonToUpdate].isActive;
			setCrimeButtons(updatedButtons);
		 

		//TODO either remove filter from list of all crimes - or add to list of crimes to hide
		//TODO don't save filters with favourite - too much hassle? see later
	
	};

//TODO FRI - API call (move to external file at some point) - then update mapurl context
	const applyFilters = () => {
		props.onHide(); //hide filter modal


		//TODO pass new filters array to map display?
		//redirect to favourites page
		// let path = `/results`; //TODO get path of calling page maybe as prop
		//	history.push(path); //TODO pass new filters as history data

		//TODO option 1 - regex search and replace text from mapURL related to filters
		//TODO option 2 - make API call - might be better putting the function code
		//TODO for API call in parent component-mapDisplay - then calling it from here on
		//TODO apply filters button press - that way maybe some info I need to make API call
		//TODO will be in props and can be added to props
		
		// history.push (`/results`, {
		// 	mapurl: aMapURL,
		// 	title: title, //TODO needed?
		// 	isfavourite: 'true', //TODO needed?? is map a previously favourited map or new search result
		//   });
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
		<Modal {...props} size="lg" centered>
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
				className='btn-footer' 
				variant="red" 
				onClick={resetFilters}>
					Reset
				</Button>
				<Button
				className='btn-footer'
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
