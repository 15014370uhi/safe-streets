import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
//import firebase from 'firebase';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {useHistory} from 'react-router-dom';
import {Route, Redirect} from 'react-router-dom';
import MapDisplay from './MapDisplay';

import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';

// Style components
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardBody,
	MDBModalFooter,
	MDBIcon,
	MDBCardHeader,
	MDBBtn,
	MDBInput,
	MDBFormInline,
} from 'mdbreact';

const Search = () => {
	const user = useContext(UserContext); // Get User Context
	const [responseData, setResponseData] = useState({});
	const [message, setMessage] = useState('');
	const [mapURL, setMapURL] = useState('');

	// User input search parameters
	const [radioButton, setRadioButton] = useState('0'); // Radio button
	const [numberOfMonths, setNumberOfMonths] = useState(0);
	const [namedLocation, setNamedLocation] = useState('');
	const [lat, setLat] = useState('');
	const [lon, setLon] = useState('');
	const [dropdownTitle, setDropdownTitle] = useState('NUMBER OF MONTHS');

	// Errors
	const [error, setError] = useState(null);

	const history = useHistory();

	// TODO maybe push to map display page - or user a check mapResponse? ():() type of thing

	// TODO show search form but have it minimise? or hide or something - or tab thing but
	// TODO jump tot he new tab
	// TODO Loading animation for map load -needs improvements for map loading

	useEffect(() => {}, []);

	// Handler which records currently selected radio button
	const radioClickedHandler = (radioSelected) => {
		setRadioButton(radioSelected);
	};

	// Handler which updates state with user form input
	const formInputHandler = (e) => {
		const {name, value} = e.currentTarget;

		// TODO check types of input are correct etc. and set error if wrong
		//setError(error);

		// If namedLocation input set namedLocation
		if (name === 'namedLocation') {
			setNamedLocation(value);			
		} else if (name === 'lat') {
			// If latitude input, set lat state
			setLat(value);			
		} else if (name === 'lon') {
			// If longitude input, set lon state
			setLon(value);				
		} 
	};

	// Dropdown handler
	const dropHandler = (e) => {
				setNumberOfMonths(e);
				setDropdownTitle(e);
			//console.log("Months set to: " + e + " >> " + numberOfMonths);
			}

			// TODO CSS for dropdown hover values

	// Reset state values
	const resetState = () => {
		// API call successful, reset state
		setNamedLocation('');
		setLat('');
		setLon('');
		setRadioButton('0');
		setNumberOfMonths(0)
		setDropdownTitle('NUMBER OF MONTHS');
	};

	// Function which submits search to API
	const fetchData = async (e) => {
		e.preventDefault();
		setMessage('Loading...');

		const isNameSearch = radioButton === '0';

		// Data passed to API
		const payload = {
			namedlocation: namedLocation,
			isnamesearch: isNameSearch,
			lat: lat,
			lon: -lon,
			numberofmonths: numberOfMonths,
		};

		// TODO get the lat and long response and show on map screen as useful data?>
		// TODO maybe have a special area for information about the map at side?

		// API call for a new search
		await axios
			.post('http://localhost:5000/api/map', payload)
			.then((res) => {
				// TEST response
				const isNamedSearch = res.data.isnamesearch;
				const namedlocation = res.data.namedlocation;
				const latitude = res.data.lat;
				const longitude = res.data.lon;
				const numberOfMonths = res.data.numberofmonths;
				const mapurl = res.data.mapurl;

				setMessage(
					'Name search?: ' +
						isNamedSearch +
						'......' +
						'Location Name: ' +
						namedlocation +
						'...... ' +
						'Latitude: ' +
						latitude +
						' ...... ' +
						'Longitude: ' +
						longitude +
						'Months: ' +
						numberOfMonths +
						'......  ' +
						'MapURL: ' +
						mapurl
				);

				// Set mapURL state
				setMapURL(res.data.mapurl);

				// Reset state values
				resetState();
			})
			.catch((error) => {
				console.log('error in search getting response: ', error);
				setError(error);
			});
	};

	// TODO maybe redirect to some map dispay component - OR - REPLACE form with map>?
	// TODO Or copy what i did with other assignment and use tabs
	return (
		<MDBContainer>
			<MDBRow>
				<MDBCol size="12" sm="10">
					<MDBCard>
						<MDBCardBody>
							<MDBCardHeader className="form-header bg-primary rounded">
								<h1 className="my-3">
									<MDBIcon icon="globe" /> Search
								</h1>
							</MDBCardHeader>

							<form onSubmit={fetchData}>
							<fieldset className={
										radioButton === '0'
											? 'selectedFieldSet'
											: 'notSelectedFieldSet'
									}>
								<label>
									
									Search by street location
									<input
										className="form-radio"
										type="radio"
										checked={radioButton === '0'}
										onClick={(e) =>
											radioClickedHandler('0')
										}
										onChange={formInputHandler}
										id="searchRadioStreet"
									/>
								</label>
								

								<MDBInput
									autoFocus={
										{radioButton} === '0' ? true : false
									}
									label="Street Address..."
									size="lg"
									icon="road"								
									type="text"
									name="namedLocation"
									value={namedLocation}
									onChange={formInputHandler}
									onClick={(e) => radioClickedHandler('0')}
								/>
								</fieldset>

								<fieldset className={
										radioButton === '1'
											? 'selectedFieldSet'
											: 'notSelectedFieldSet'
									}>
								<label>									
									Search by latitude and longitude
									<input
										className="form-radio"
										type="radio"
										checked={radioButton === '1'}
										onClick={(e) =>
											radioClickedHandler('1')
										}
										onChange={formInputHandler}
										id="searchRadioLatLon"
									/>
								</label>

								<MDBInput
									autoFocus={
										radioButton === '1' ? true : false
									}
									label="Latitude..."
									size="lg"
									icon="map-marker-alt"								
									type="text"
									name="lat"
									value={lat}
									onChange={formInputHandler}
									onClick={(e) => radioClickedHandler('1')}
								/>
								<MDBInput
									label="Longitude..."
									size="lg"
									icon="map-marker-alt"																										
									type="text"
									name="lon"
									value={lon}
									onChange={formInputHandler}
									onClick={(e) => radioClickedHandler('1')}
								/>
								</fieldset>
								<p>Number of months selected: {numberOfMonths}</p>
								

								<Dropdown 
								name="monthsDropdown"
								id="dropdown-months-button" 
								size="lg"								
								onSelect={(e) => dropHandler(e)}>
									<Dropdown.Toggle
										variant="danger"
										id="dropdown-months-toggle">
										{dropdownTitle}
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<Dropdown.Item eventKey="3">3
										</Dropdown.Item>
										<Dropdown.Item eventKey="6">6
										</Dropdown.Item>
										<Dropdown.Item eventKey="12">12
										</Dropdown.Item>
										<Dropdown.Item eventKey="24">24
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							

								<div className="text-center mt-4">
									{error !== null && (
										<div className="py-4 bg-red-600 w-full text-red text-center mb-3">
											{error}
										</div>
									)}
									<MDBBtn
										color="secondary"
										className="mb-3"
										block
										size="lg"
										type="submit">
										Submit
									</MDBBtn>
								</div>
							</form>
							<br />							
							<p>{message}</p>
							<Container>
								<MapDisplay mapURL={mapURL} />
							</Container>
						</MDBCardBody>
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
};

export default Search;
