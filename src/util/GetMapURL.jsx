import axios from 'axios';

//new search
export const getMapURL = async (payload) => {
	let dataResponse = await TESTAPICall(payload);

	//	let dataResponse = APICall(payload);

	console.log('dataResponse' + dataResponse);
	return dataResponse;
};

//filtering previous search display //TODO check whats needed below
export const getUpdatedMapURL = (aPayload) => {

	console.log("getUpdatedMapURL ARGS: " 
	+ "isnamesearch: " + aPayload.isnamesearch
	+ "lat: " + aPayload.lat
	+ "lon: " + aPayload.lon
	+ "numberofmonths: " + aPayload.numberofmonths
	+ "filters: " + aPayload.filters);

	let payload = {
		namedlocation: '', //TODO will need location of lat lon from url?
		isnamesearch: false,
		lat: aPayload.lat, //TODO set from server response? then can use them again
		lon: aPayload.lon,
		numberofmonths: aPayload.numberofmonths,
		filters: aPayload.filters,
	};

	APICall(payload); //TODO need to set map details or return the response to calling method
	//return TESTAPICall(payload);};
};

//function which completes an API call
const APICall = async (payload) => {
	return new Promise((resolve) => {
		axios
			.post('http://localhost:5000/api/map', payload)
			.then((res) => {
				const response = {
					mapurl: res.data.mapurl,
					isNamedSearch: res.data.isnamesearch,
					locationName: res.data.locationname,
					latitude: res.data.lat,
					longitude: res.data.lon,
					numberOfMonths: res.data.numberofmonths, //TEST
					boundingbox: res.data.boundingbox, //TEST
					filters: res.data.filters, //TEST
				};
				resolve(response);
			})
			.catch((error) => {
				console.log('error in obtaining API response: ', error.message);
			});
	});
};

//function which completes an API call with a payload
const TESTAPICall = (payload) => {
	return new Promise((resolve) => {
		axios
			.post('http://localhost:5000/api/map', payload)
			.then((res) => {
				const response = { //TODO make these small case
					mapurl: res.data.mapurl,
					isNamedSearch: res.data.isnamesearch,
					locationName: res.data.locationname,
					latitude: res.data.lat,
					longitude: res.data.lon,
					numberOfMonths: res.data.numberofmonths,
					boundingbox: res.data.boundingbox,
					filters: res.data.filters,
				};
				resolve(response);
			})
			.catch((error) => {
				console.log('error in obtaining API response: ', error.message);
			});
	});
};

// const response = axios.post('http://localhost:5000/api/map', payload);
//     const data = await response.mapurl;
//     return data;

const test = (payload) => {
	//API call for a new search
	return new Promise(async (resolve, reject) => {
		await axios
			.post('http://localhost:5000/api/map', payload)
			.then((res) => {
				const response = {
					mapurl: res.data.mapurl,
					isNamedSearch: res.data.isnamesearch,
					locationName: res.data.locationname,
					latitude: res.data.lat,
					longitude: res.data.lon,
					numberOfMonths: res.data.numberofmonths,
					boundingbox: res.data.boundingbox,
					filters: res.data.filters,
				};
				resolve(response);
			})
			.catch((error) => {
				console.log('error in obtaining API response: ', error.message);
			});
	});
};
