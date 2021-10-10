import React, {useState, useContext} from 'react';
import {MapDetails} from '../contexts/MapDetailsContext';
import {useHistory} from 'react-router-dom';
import Form from '../components/Form';
import Spinner from 'react-bootstrap/Spinner';
import {getMapURL} from '../util/GetMapURL';

//style components
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader} from 'mdbreact';

const Search = (props) => {
	const [submitText, setSubmitText] = useState('Submit');
	const [radioButton, setRadioButton] = useState('0');
	const [numberOfMonths, setNumberOfMonths] = useState(3);
	const [locationName, setLocationName] = useState('');
	const [lat, setLat] = useState('');
	const [lon, setLon] = useState('');
	const [error, setError] = useState(null);
	const history = useHistory();
	const [mapDetails, setMapDetails] = useContext(MapDetails);

	//function which updates the mapURL context
	const updateMapURL = (aMapURL, aLat, aLon, wasNameSearch) => {
		setMapDetails({
			mapURL: aMapURL,
			locationname: locationName,
			isnamesearch: wasNameSearch,
			lat: aLat,
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
			//if latitude input, set lat state
			setLat(value);
		} else if (name === 'lon') {
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
	const submitForm = async (e) => {
		e.preventDefault();

		//declare const boolean flag to determine whether this is a name search or not
		let isANameSearch = radioButton === '0';

		//form validation
		if (!isANameSearch && (isNaN(lat) || isNaN(lon))) {
			setError('Latitude and Longitude must be valid numbers');
			alert('Latitude and Longitude must be number coordinates');
		} else {
			//variable boolean flag to determine whether lat and lon coordinates are wthin the UK
			let coordinatesWithinUK = isWithinUK(lat, lon);

			//if named location search, but form location search input is empty
			if (isANameSearch && locationName === '') {
				alert('The location is empty, please enter a location!');
			} else if (!isANameSearch && (lat === '' || lon === '')) {
				//if lat and lon search, but lat or lon input boxes are empty
				alert(
					'Please add coordinates for both latitude and longitude!'
				);
			} else if (!isANameSearch && (isNaN(lat) || isNaN(lon))) {
				//if lat and lon search, but either the lat or lon value is not a number
				alert(
					'Your latitude and longitude coordinates must be numbers only!'
				);
			} else if (!isANameSearch && !coordinatesWithinUK) {
				//if lat and lon search, but coordinates are outside the bounds of UK
				alert(
					'Your latitude and longitude coordinates are outside of the UK!'
				);
			} else {
				//form input was validated
				setSubmitText(
					<div>
						<Spinner
							as="span"
							animation="border"
							role="status"
							aria-hidden="true"
							variant="dark"
						/>
						<label className="submit-btn-text">
							LOADING CRIME DATA....
						</label>
					</div>
				);

				//data to pass to API
				const payload = {
					locationname: locationName,
					isnamesearch: isANameSearch,
					lat: lat,
					lon: lon,
					numberofmonths: numberOfMonths,
					filters: [],
				};

				//call API function
				const response = await getMapURL(payload);

				//TEST
				console.log(response);


				//check if no crimes were recorded for search criteria
				const noCrimesDetected = response.nocrimes;
								

				//TODO switch to leaflet !!!!
				console.log(response.flaskdata.data);
				const anti_social_behaviour = response.flaskdata.data.Anti_social_behaviour;
				const burglary = response.flaskdata.data.Burglary;
				const criminal_damage_and_arson = response.flaskdata.data.Criminal_damage_and_arson;
				const drugs = response.flaskdata.data.Drugs;
				const possession_of_weapons = response.flaskdata.data.Possession_of_weapons;
				const public_order = response.flaskdata.data.Public_order;
				const theft = response.flaskdata.data.Theft;
				const vehicle_crime = response.flaskdata.data.Vehicle_crime;
				const violent_crime = response.flaskdata.data.Violent_crime;

				alert('Crime Probability for this week: \n\n'
					+ 'Anti-Social = ' + anti_social_behaviour/4 + '\n'
					+ 'Burglary = ' + burglary/4 + '\n'
					+ 'Criminal Damage & Arson = ' + criminal_damage_and_arson/4 + '\n'
					+ 'Drugs = ' + drugs/4 + '\n'
					+ 'Possession of Weapons = ' + possession_of_weapons/4 + '\n'
					+ 'Public Order = ' + public_order/4 + '\n'
					+ 'Theft = ' + theft/4 + '\n'
					+ 'Vehicle Crime = ' + vehicle_crime/4 + '\n'
					+ 'Violent Crime = ' + violent_crime/4 + '\n');
				

				//check for invalid lat and lon response, due to mispelled/invalid location name
				let isValidLocation = isWithinUK(response.lat, response.lon);

				//invalid search location
				if (!isValidLocation) {
					setSubmitText(
						<label className="submit-btn-text">Submit</label>
					);
					alert(
						'Location name is not recognised!, please check your spelling'
					);
				} else if (noCrimesDetected) {
					setSubmitText('Submit');
					alert('No crime data found for this search!');
				} else {
					//set lat and lon values
					setLat(response.lat);
					setLon(response.lon);

					//pass mapurl to context
					updateMapURL(
						response.mapurl,
						response.lat,
						response.lon,
						response.isnamesearch
					);
					history.push(`/results`);
				}
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
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</div>
	);
};

export default Search;
