import axios from 'axios';

//new search
export const getMapURL = async (payload) => {
	let dataResponse = await APICall(payload);	
	return dataResponse;
};

//filtering previous search display //TODO check whats needed below
export const getUpdatedMapURL = async (aPayload) => {

	let payload = {
		locationname: aPayload.locationname, //TODO will need location of lat lon from url?
		isnamesearch: aPayload.isnamesearch,
		lat: aPayload.lat, //TODO set from server response? then can use them again
		lon: aPayload.lon,
		numberofmonths: aPayload.numberofmonths,
		filters: aPayload.filters,
	};

	const response = await APICall(payload); //TODO need to set map details or return the response to calling method
	return response; //TODO might need a then here ...	
};

//function which completes an API call
const APICall = async (payload) => {

	return new Promise((resolve) => {
		axios
			.post('http://localhost:4000/api/map', payload)
			.then((res) => {
				const response = {
					flaskdata: res.data.flaskdata,
					boundingbox: res.data.boundingbox, 
					filters: res.data.filters, 
					isnamesearch: res.data.isnamesearch,
					lat: res.data.lat,
					lon: res.data.lon,
					location: res.data.location,
					locationname: res.data.locationname,
					mapurl: res.data.mapurl,					
					numberofmonths: res.data.numberofmonths, 					
					nocrimes: res.data.nocrimes,					
				};
				resolve(response);
			})
			.catch((error) => {
				console.log('error in obtaining API response: ', error.message);
			});
	});
};
