import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
//import firebase from 'firebase';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
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

	const [namedLocation, setNamedLocation] = useState('');
	const [lat, setLat] = useState('');
	const [lon, setLon] = useState('');

	// Errors
	const [error, setError] = useState(null);

	const history = useHistory();

	// TODO maybe push to map display page - or user a check mapResponse? ():() type of thing

	// TODO show search form but have it minimise? or hide or something - or tab thing but
	// TODO jump tot he new tab
	// TODO Loading animation for map load -needs improvements for map loading

	useEffect(() => {}, []);

	// Handler for radio button selection change
	const radioClickedHandler = (radioSelected) => {
		setRadioButton(radioSelected);
	};

	// Function to handle user form input
	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;

		// If namedLocation input set namedLocation
		if (name === 'namedLocation') {
			setNamedLocation(value);
			console.log('namedlocation state: ' + namedLocation);
		} else if (name === 'lat') {
			// If latitude input, set lat state
			setLat(value);
			//console.log("lat input: " + value);
			console.log('lat state: ' + lat);
		} else if (name === 'lon') {
			// If longitude input, set lon state
			setLon(value);
			//	console.log("lon input: " + value);
			console.log('lon state: ' + lon);
		}
	};

	// fetches stock data based on parameters
	const fetchData = async (e) => {
		e.preventDefault();
		setMessage('Loading...');

		const payload = {
			searchlocation: 'Perth',
			isnamesearch: true,
			lat: 14.566848,
			lon: -11.25456,
		};

		await axios
			.post('http://localhost:5000/api/map', payload)
			.then((res) => {
				setMessage(res.data.lat);
				// TODO get the lat and long response and show on map screen as useful data?>
				// TODO maybe have a special area for information about the map at side?
				setMapURL(res.data.mapurl);
			})
			.catch((error) => {
				console.log('error in search getting response: ', error);
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
								<label
									className={
										radioButton === '0'
											? 'selectedFieldSet'
											: 'notSelectedFieldSet'
									}>
									Search by street location
									<input
										className="form-radio"
										type="radio"
										checked={radioButton === '0'}
										onClick={(e) =>
											radioClickedHandler('0')
										}
										onChange={(e) => onChangeHandler(e)}
										id="searchRadioStreet"
									/>
								</label>

								<MDBInput
									autoFocus={
										{radioButton} === '0' ? true : false
									}
									placeholder="Street Address..."
									size="lg"
									icon="road"
									radiobuttontype="0"
									group
									type="text"
									name="namedLocation"
									value={namedLocation}
									onChange={(e) => onChangeHandler(e)}
									onClick={(e) => radioClickedHandler('0')}
								/>

								<label
									className={
										radioButton === '1'
											? 'selectedFieldSet'
											: 'notSelectedFieldSet'
									}>
									Search by latitude and longitude
									<input
										className="form-radio"
										type="radio"
										checked={radioButton === '1'}
										onClick={(e) =>
											radioClickedHandler('1')
										}
										onChange={(e) => onChangeHandler(e)}
										id="searchRadioLatLon"
									/>
								</label>

								<MDBInput
									autoFocus={
										radioButton === '1' ? true : false
									}
									placeholder="latitude"
									size="lg"
									icon="map-marker-alt"
									group
									radiobuttontype="1"
									type="text"
									name="lat"
									value={lat}
									onChange={(e) => onChangeHandler(e)}
									onClick={(e) => radioClickedHandler('1')}
								/>
								<MDBInput
									placeholder="longitude"
									size="lg"
									icon="map-marker-alt"
									group
									radiobuttontype="1"
									type="text"
									name="lon"
									value={lon}
									onChange={(e) => onChangeHandler(e)}
									onClick={(e) => radioClickedHandler('1')}
								/>

								<div className="text-center mt-4">
									{error !== null && (
										<div className="py-4 bg-red-600 w-full text-red text-center mb-3">
											{error}
										</div>
									)}
									<MDBBtn
										color="light-blue"
										className="mb-3"
										type="submit">
										Submit
									</MDBBtn>
								</div>
							</form>
							<br />
							<p>{message}</p>
							<p>{mapURL}</p>
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
