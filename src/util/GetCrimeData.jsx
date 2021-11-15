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

export const getCrimeCategory = (aCrimeCategory) => {
	let crimeCategory = "";
	switch (aCrimeCategory) {
		case "Anti-social behaviour": // Low threat
			crimeCategory = "Anti-Social Behaviour";
			break;

		case "Burglary": // Medium threat
			crimeCategory = "Burglary";
			break;

		case "Criminal damage and arson": // Medium threat
			crimeCategory = "Criminal Damage & Arson";
			break;

		case "Drugs": // Low threat
			crimeCategory = "Drugs";
			break;

		case "Possession of weapons": // High threat
			crimeCategory = "Possession of Weapons";
			break;

		case "Public order": // Low threat
			crimeCategory = "Public Order";
			break;

		case "Robbery": //High threat
			crimeCategory = "Robbery";
			break;

		case "Shoplifting": // Low threat
			crimeCategory = "Shoplifting";
			break;

		case "Theft": // Medium threat
			crimeCategory = "Theft";
			break;

		case "Vehicle crime": // Medium threat
			crimeCategory = "Vehicle Crime";
			break;

		case "Violent crime": // High threat
			crimeCategory = "Violent Crime";
			break;

		default:
			//intentially blank
			break;
	}
	return crimeCategory;
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

// function which sorts an array of crimes from highest to lowest percentage value
export const sortCrimesByPercentage = (predictions) => {
	var result;

	// sort crimes by lowest to highest percentage
	result = predictions.sort(function (crimeA, crimeB) {
		return crimeA.percentage - crimeB.percentage;
	});

	// reverse order
	result.reverse();

	return result;
};

// function which populates an array with formatted crime predictions
export const populateCrimes = (predictions) => {
	var results = [];

	for (var crime in predictions.percentages) {
		var crimeCategory = getCrimeCategory(crime);
		var crimeOccurence = parseInt(predictions.totals[crime]);
		var percentageOfCrimes = parseFloat(predictions.percentages[crime]);

		var crimeData = {
			crime: crimeCategory,
			occurrences: crimeOccurence,
			percentage: percentageOfCrimes,
		};
		results.push(crimeData);
	}
	results = sortCrimesByPercentage(results);

	return results;
};

// function which finds the most prolific crimes from an array of crimes
export const getThreatLevel = (predictions) => {
	
	var threatLevel = "Low";

	// format crime data as objects
	const formattedCrimeArray = populateCrimes(predictions);

	// sort predictions by percentage
	const sortedPredictions = sortCrimesByPercentage(formattedCrimeArray);

	//for (var counter = 0; counter < 3; counter++) {
	for (var counter = 0; counter < 2; counter++) {
		var crimeType = sortedPredictions[counter].crime;

		// check which crimes are highest two predicted crime types
		if (
			crimeType === "Possession of Weapons" ||
			crimeType === "Violent Crime" ||
			crimeType === "Robbery"
		) {
			threatLevel = "High";
			break;
		} else if (
			crimeType === "Vehicle Crime" ||
			crimeType === "Theft" ||
			crimeType === "Criminal Damage & Arson" ||
			crimeType === "Burglary"
		) {
			threatLevel = "Medium";			
			break;
		}
	}
	return threatLevel;
};
