import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
//import firebase from 'firebase';
import axios from 'axios';

const Search = () => {
	const user = useContext(UserContext); // Get User Context
	const [responseData, setResponseData] = useState('');
	const [message, setMessage] = useState('');

	//const {displayName, username, email} = user; // Deconstruct user document elements

	//const [localFavouritesTotal, setLocalFavouritesTotal] = useState([]);
	//const [localUserName, setLocalUserName] = useState(null);
	// const [localDisplayName, setLocalDisplayName] = useState(null);

	useEffect(() => {
		// getUserDetails();
		//testGetMapURL();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//TODO  Later wont be called in user effect - but when user hits submit in search form
	// const testGetMapURL = async () => {
	//   const searchTerm = "a user search term";
	//   axios
	//   .get('http://localhost:5000/api/map/' + searchTerm)
	//   .then((res) => console.log(res.data));
	//   setTestResponse({
	//   favourites: favourites.favourites.filter((aFavourite) => aFavourite._id !== id),
	// });
	// }

	// fetches stock data based on parameters
	const fetchData = async (e) => {
		e.preventDefault();
		setMessage('Loading...');

	// 	const userobject = 
    // {
	// 		name: 'testName',
	// 		email: 'testEmail',
	// 	};

	const title = "a test title";
	const testData = {
        title
      };

      await axios.post("http://localhost:5000/api/map", testData).then((res) => {
				console.log(res.data);				
			})
			.catch((error) => {
				console.log('error in search getting response: ', error);
			});
	};




	const testnew = async (e) => {
		e.preventDefault();
		console.log("Button clicked");
		const title = 'aUserSearchTerm';
		
		const path = 'http://localhost:5000/api/map/';
		//axios.get('http://localhost:5000/api/map/' + searchterms)
		await axios.get(path, {
				params: {
					title: title,
				},
			})
			.then((res) => {
				setResponseData(res.data);
				setMessage('');
				console.log(res.data);
			})
			.catch((err) => {
				setMessage('Error retrieving API data');
				console.log(err);
			});
	};


	// const testnew2 = async (e) => {
	// 	e.preventDefault();
	// 	console.log("Button clicked");
	// 	const body = {
	// 		title: "aTestTitle",
	// 	}
	// //axios.get('http://localhost:5000/api/map/', {
	// 	axios.get('http://localhost:5000/api/test/', body {
	// 	// params: {
	// 	//   "title": "testTitle"
	// 	// }
	//   })
	//   .then(function (response) {
	// 	  console.log("response received");
	// 	console.log(response);
	//   })
	//   .catch(function (error) {
	// 	console.log(error);
	//   });
	// }



	// // api.stockTimeSeries(ticker)
	// // .then((response)=>{
	// //    setResponseData(response.data)
	// //    setMessage('')
	// //    console.log(response)
	// // })
	// // .catch((error) => {
	// //    setMessage('Error')
	// //    console.log(error)
	// // })
	// //};

	//axios
	//   .get('http://localhost:5000/favourites/' + id)
	//   .then((res) => console.log(res.data));
	// setFavourites({
	//   favourites: favourites.favourites.filter((aFavourite) => aFavourite._id !== id),

	return (
		<React.Fragment>
			<form onSubmit={fetchData}>
				<fieldset>
					<legend>Test getting API data</legend>
					<button type="submit">Submit</button>
				</fieldset>
			</form>
			<p>{message}</p>
			{responseData}
		</React.Fragment>
	);
};

export default Search;
