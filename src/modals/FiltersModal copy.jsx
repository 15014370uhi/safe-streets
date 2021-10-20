import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonFilterCrime from '../components/ButtonFilterCrime';
import uuid from 'react-uuid';

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
			label: 'Public Order',
			categories: ['public-order', 'other-crime'],
			isActive: true,
		},				
		{
			label: 'Shoplifting',
			categories: ['shoplifting'],
			isActive: true,
		},
		{
			label: 'Theft',
			categories: ['other-theft', 'bicycle-theft', 'theft-from-the-person'],
			isActive: true,
		},
		{
			label: 'Vehicle Crime',
			categories: ['vehicle-crime'],
			isActive: true,
		},
		{
			label: 'Violent Crime',
			categories: ['violent-crime',],
			isActive: true,
		},	
		{
			label: 'Weapons',
			categories: ['possession-of-weapons'],
			isActive: true,
		},	
	]);

	const [appliedFilters, setAppliedFilters] = useState([]);

	useEffect(() => {
		setPreviousFilters(props.mapdetails.filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//apply any filters supplied as props from previously filtered favourite
	const setPreviousFilters = (filtersToApply) => {	
		setAppliedFilters(filtersToApply); //set filters state to loaded filters		
		filtersToApply.forEach((aFilterCategory) => {
			const indexOfButtonToUpdate = crimeButtons.findIndex(
				(aButton) => aButton.categories.includes(aFilterCategory)				
			);
			changeFilterState(crimeButtons[indexOfButtonToUpdate].label); //call function with label of corresponding button
		});
	};

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

	//function to apply selected filters to map display
	const applyFilters = async () => {
		//TODO animate apply filters button - to give time for new filtered map to arrive
		//TODO dont close modal until button states show they are dropHandler
		//TODO might need another button like - apply - after filters reset

		//TODO whatever causes them to cahange state when clicking on filter buttons - reverse that for
		//TODO the reset button - just do same thing
		props.onHide(); //hide filter modal interface
		props.updateMapURL(filters);
	};

	const resetFilters = () => {
		filters = [];

		//iterate over all buttons and call the change state function for each
		for (let aButton of crimeButtons) {
			if (!aButton.isActive) {
				changeFilterState(aButton.label);
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
					Apply
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FiltersModal;
