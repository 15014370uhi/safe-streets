import React, {useState} from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import uuid from 'react-uuid';
import '../App.css';


const FilterButtonsList = () => {

	// Set filter state
	const [filters, setFilters] = useState([
		{
			name: 'Theft',
			displayCrimes: true,
		},
		{
			name: 'Burglary',
			displayCrimes: true,
		},
		{
			name: 'Drugs',
			displayCrimes: true,
		},
		{
			name: 'Weapons',
			displayCrimes: true,
		},
		{
			name: 'Anti-Social',
			displayCrimes: true,
		},
		{
			name: 'Robbery',
			displayCrimes: true,
		},
		{
			name: 'Vehicle Crime',
			displayCrimes: true,
		},
		{
			name: 'Violent Offences',
			displayCrimes: true,
		},
		{
			name: 'Public Order',
			displayCrimes: true,
		},
	]);

	// TODO https://stackoverflow.com/questions/57888975/how-to-update-react-context-provider-state-on-button-click

	const defaultFilters = [
		'Theft',
		'Burglary',
		'Drugs',
		'Weapons',
		'Anti-Social',
		'Robbery',
		'Vehicle Crime',
		'Violent Offences',
		'Public Order',
	];

	// State for material-ui button styling
	const [formats, setFormats] = useState(defaultFilters);

	const handleFormat = (event, activeFilters) => {
		if (activeFilters.includes('reset')) {
			setFormats(defaultFilters); // Reset button clicked - Reset all filters
		} else {
			setFormats(activeFilters); // Add Clicked filter button to list of active filters
		}
		//TEST
    //console.log('Active Filters: now contains: ' + activeFilters);
    //TODO - CAll function to result in generating new map with crime icons filtered - API CALL
	};

	return (
		<div>
			<ToggleButtonGroup
				value={formats}
				onChange={handleFormat}
				aria-label="text formatting">
				{filters.map((filter) => (
					<ToggleButton
						value={filter.name}
						aria-label={filter.name}
						key={uuid()}>
						{filter.name}
					</ToggleButton>
				))}
				<ToggleButton
					value="reset"
					aria-label="reset filters"
					key={uuid()}>
					Reset Filters
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	);
};

export default FilterButtonsList;
