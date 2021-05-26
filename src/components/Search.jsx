import React, {useState, useContext} from 'react';
import {MapURL} from '.././contexts/MapContext';
import {MapDetails} from '.././contexts/MapDetailsContext';
//import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Form from './Form';
import Spinner from 'react-bootstrap/Spinner';
import {getMapURL, TESTAPICall} from './../util/GetMapURL';

// Style components
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader} from 'mdbreact';

const Search = (props) => {
	const [submitText, setSubmitText] = useState('Submit');
	const [testText, setTestText] = useState('');
	const [radioButton, setRadioButton] = useState('0');
	const [numberOfMonths, setNumberOfMonths] = useState(3);
	const [locationName, setLocationName] = useState('');
	const [isNameSearch, setIsNameSearch] = useState('0');
	const [lat, setLat] = useState('');
	const [lon, setLon] = useState('');
	const [error, setError] = useState(null);
	const history = useHistory();

	// TODO Loading animation for map load -needs improvements for map loading

	const [mapURL, setMapURL] = useContext(MapURL);	
	const [mapDetails, setMapDetails] = useContext (MapDetails);

	// const filters = [
    //     'vehicle-crime',
    //     'anti-social-behaviour',
    //     'violent-crime',
    //     'shoplifting',
    //     'other-crime',
    //     'public-order',
    //     'possession-of-weapons',
    //     'other-theft',
    //     'burglary',
    //     'robbery',
    //     'theft-from-the-person',
    //     'criminal-damage-arson',
    //     'bicycle-theft',
    //     'drugs',
    //   ];



	//function which updates the mapURL context
	
	const updateMapURL = (aMapURL, aLat, aLon) => {
		//setMapURL(aMapURL); //
		
		//TODO trace order of things after filters are applied
		
		// console.log("SEARCH: updating mapDetails context with: " 
		//  + "aMapURL: " + aMapURL
		//  + "\nisNameSearch: " + isNameSearch
		//  + "\nnumberofmonths: " + numberOfMonths
		//  + "\nlat: " + aLat
		//  + "\nlon: " + aLon
		//  + "\n");

	//setMapDetails(prevState => ({
		setMapDetails({ //TODO check - should filters be emtpy?
			mapURL: aMapURL,		
			locationname: locationName,
			isnamesearch: isNameSearch,
			lat: aLat, //TODO needs to be from response or is it already?
			lon: aLon,
			numberofmonths: numberOfMonths,
			filters: [],
		});
	};

	//handler which records currently selected radio button
	const radioClickedHandler = (radioSelected) => {
		setRadioButton(radioSelected);
	};

	//handler which updates state with user form input
	const formInputHandler = (e) => {
		const {name, value} = e.currentTarget;
		//if locationName selected, set locationName
		if (name === 'locationName') {
			setLocationName(value);
		} else if (name === 'lat') {
			//check that lat is a number
			if (!isNaN(value)) {
				setError('Latitude and Longitude must be numbers');
			}
			//TODO alert warning and don't submit

			//if latitude input, set lat state
			setLat(value);
		} else if (name === 'lon') {
			//check that lon is a number
			if (!isNaN(value)) {
				setError('Latitude and Longitude must be numbers');
			}
			//if longitude input, set lon state
			setLon(value);
		}
	};

	//dropdown handler for months
	const dropHandler = (selectedNumberOfMonths) => {
		if (selectedNumberOfMonths === 0) {
			selectedNumberOfMonths = 3;
		}
		setNumberOfMonths(selectedNumberOfMonths);
	};

	/**
	 * Function to check that a set of latitude and longitude coordinates lie
	 * within the united kingdom boundary
	 * @param {Number} lat The latitude coordinate
	 * @param {Number} lon The longituded coordinate
	 *
	 * @returns {Boolean} isValidCoordinate Returns true if coordinate lies within UK territory
	 */
	const isWithinUK = (lat, lon) => {
		let isValidCoordinate = true;
		if (lat < 49.88 || lat > 60.86 || lon < -8.21 || lon > 1.77) {
			isValidCoordinate = false;
		}
		return isValidCoordinate;
	};

	//function which submits search to API
	const submitForm = async e => {
	//const submitForm = async (e) => {
		e.preventDefault();

		//declare const boolean flag to determine whether this is a name search or not
		//const isNameSearch = radioButton === '0';
		setIsNameSearch(radioButton === '0')

		//variable boolean flag to determine whether lat and lon coordinates are wthin the UK
		let coordinatesWithinUK = isWithinUK(lat, lon);

		//TODO block API call if any inputs are invalid

		// Form validation

		//if named location search was selected but form input is empty
		if (isNameSearch && locationName === '') 
		{
			alert('The location is empty, please enter a location!');
			//if lat and lon search but lat and lon input is empty
		} 
		else if (!isNameSearch && (lat === '' || lon === '')) {
			alert('Please add coordinates for latitude and longitude!');
		} 
		else if (!isNameSearch && (isNaN(lat) || isNaN(lon))) {
			//if lat and lon search but the lat or lon value is not a number
			alert(
				'Your latitude and longitude coordinates must be numbers only!'
			);
		} 
		else if (!isNameSearch && !coordinatesWithinUK) 
		{
			//if lat and lon search but user coordinates are outside the bounds of the UK
			alert(
				'Your latitude and longitude coordinates are outside of the UK!'
			);
		} 
		else //form input was validated
		{	
			//data to pass to API
			const payload = 
			{
							locationname: locationName,
							isnamesearch: isNameSearch,
							lat: lat,
							lon: lon,
							numberofmonths: numberOfMonths,
							filters: [],
			};

			// TODO get the lat and long response and show on map screen as useful data?>
			// TODO maybe have a special area for information about the map at side?
		
			const response = await getMapURL(payload);			
		
			//check for invalid lat and lon response, due to mispelled/invalid location name
			let isValidLocation = isWithinUK(response.lat, response.lon);

			//TODO set mapdetails 
			 
			//invalid search location
			if (!isValidLocation)
			{
				alert('Location name is not recognised!, please check your spelling'				);
			} 
			else 
			{ 				
				//set lat and lon values	
				setLat(response.lat); 
				setLon(response.lon);


				//TODO update all mapDetails fields with server response lat lon etc
				//console.log("RESPONSE normal search lat and long: " + response.latitud)


				//TODO submit text no longer working for loading animation
				setSubmitText(
				<div>
					<Spinner
						as="span"
						animation="border"
						role="status"
						aria-hidden="true"
						variant="dark"
					/>{' '}
					LOADING....{' '}
					</div>);
					
					//pass mapurl to context //TODO just pass resopnse object?
					updateMapURL(response.mapurl, response.lat, response.lon);  //TODO check how to pass more
					history.push(`/results`);
			}			
		}					
	};

	return (
		<div className="search-map-div">
			<MDBRow>
				<MDBCol size="12" sm="10" className="form-card">
					<MDBCard>
						<MDBCardBody>
							<MDBCardHeader className="form-header bg-primary rounded">
								<i className="fas fa-globe" />
								<label className="header-label">Search</label>
							</MDBCardHeader>
							<Form
								submitForm={submitForm}
								formInputHandler={formInputHandler}
								locationName={locationName}
								lat={lat}
								lon={lon}
								numberOfMonths={numberOfMonths}
								error={error}
								dropHandler={dropHandler}
								radioButton={radioButton}
								radioClickedHandler={radioClickedHandler}
								submitText={submitText}
							/>
						</MDBCardBody>
						{testText}
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</div>
	);
};

export default Search;
