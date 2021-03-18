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

const Search = () => {
	const user = useContext(UserContext); // Get User Context
	const [responseData, setResponseData] = useState({});
	const [message, setMessage] = useState('');
	const [mapURL, setMapURL] = useState('');
	const [location, setLocation] = useState('');

	const history = useHistory();

	// TODO maybe push to map display page - or user a check mapResponse? ():() type of thing
	//const {displayName, username, email} = user; // Deconstruct user document elements
	//const [localFavouritesTotal, setLocalFavouritesTotal] = useState([]);
	//const [localUserName, setLocalUserName] = useState(null);
	// const [localDisplayName, setLocalDisplayName] = useState(null);

	// TODO show search form but have it minimise? or hide or something - or tab thing but
	// TODO jump tot he new tab

	useEffect(() => {}, []);

	// fetches stock data based on parameters
	const fetchData = async (e) => {
		e.preventDefault();
		setMessage('Loading...');

		// const searchLocation = 'Perth';
		// const isNameSearch = true;
		// const lat = 14.566848;
		// const lon = -11.25456;

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
				setMapURL(res.data.mapurl);
			})
			.catch((error) => {
				console.log('error in search getting response: ', error);
			});
	};

	// TODO maybe redirect to some map dispay component - OR - REPLACE form with map>?
	// TODO Or copy what i did with other assignment and use tabs
	return (
		<React.Fragment>
			<div>
				User: {user.email}
				<form onSubmit={fetchData}>
					<fieldset>
						<legend>Test getting API data</legend>
						<button type="submit">Submit</button>
					</fieldset>
				</form>
				<br />
				<p>{message}</p>
				<p>{mapURL}</p>
				<Container>
					<MapDisplay mapURL={mapURL} />
				</Container>
			</div>
		</React.Fragment>
	);
};

export default Search;

//<Image src={mapURL} />
