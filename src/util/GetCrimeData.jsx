import axios from "axios";

export const getCrimeData = async (payload) => {
	return new Promise((resolve) => {
		axios
			.post("http://localhost:4000/api/map", payload)
			.then((res) => {
				const response = {
					predictions: res.data.predictions,
					historicCrimes: res.data.historicCrimes,
					locationName: res.data.locationName,
					lat: res.data.lat,
					lon: res.data.lon,
					noCrimes: res.data.noCrimes,
					policeForce: res.data.policeForce,
					allCrimes: res.data.allCrimes,
				};
				resolve(response);
			})
			.catch((error) => {
				console.log("error in obtaining node API response: ", error);
			});
	});
};

// function which completes an API call to get predicted crime rates
export const getPredictions = async (payload) => {
	return new Promise((resolve) => {
		axios
			.post("http://localhost:4000/api/map/predictions", payload)
			.then((res) => {
				const response = {
					predictions: res.data.predictions,
				};
				resolve(response);
			})
			.catch((error) => {
				console.log(
					"error in obtaining prediction results from API: ",
					error
				);
			});
	});
};

// function which completes an API call to obtain historic crime data
export const getHistoricCrimes = async (payload) => {
	return new Promise((resolve) => {
		axios
			.post("http://localhost:4000/api/map/historic", payload)
			.then((res) => {
				const response = {
					historicCrimes: res.data.historicCrimes,
				};
				resolve(response);
			})
			.catch((error) => {
				console.log("error in obtaining historic crimes from API: ");
			});
	});
};

// return threat level for search area
export const getThreatLevel = (predictions) => {
	var threatLevel = "green";
	var highestPercentage = parseFloat("0");

	for (var aPrediction in predictions) {
		var crimeProbability = parseFloat(predictions[aPrediction]);

		if (crimeProbability > highestPercentage) {
			highestPercentage = crimeProbability;
		}
	}

	if (highestPercentage > 30) {
		threatLevel = "red";
	} else if (highestPercentage < 30 && highestPercentage > 20) {
		threatLevel = "yellow";
	}
	return threatLevel;
};

// return threat level for search area
export const getHighThreats = (predictions) => {
	var highThreatCrimes = [];
	
	return highThreatCrimes;
};
