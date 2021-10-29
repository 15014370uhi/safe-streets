/**
 * Function which converts a month number into the string name equivalent
 * @param {aMonthNumber} the number of the month
 * @returns {string} The name of the month
 */
const getMonthName = (aMonthNumber) => {
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return months[aMonthNumber];
};

/**
 * Function which extracts the year and month from a string and returns
 * a Date object representation
 *
 * @param {string} stringDate String representation of year and month
 *
 * @return {Date} The date object containing year and month of crime
 */
const getYearAndMonth = (stringDate) => {
	const crimeYear = stringDate.slice(0, 4);
	var crimeMonth = stringDate.slice(5);
	crimeMonth = parseInt(crimeMonth - 1); // preparation for Date object zero indexing
	const crimeDate = new Date(crimeYear, crimeMonth);

	return crimeDate;
};

/**
 * Function which returns an array of dates in the format YYYY-MM
 * for a given number of months, begining 1 month prior
 * to the current month
 *
 * @param {number} numberOfMonthsRequired The number of months to check for crimes
 *
 * @return {array} The array of dates to check for crimes
 */
const populateCrimeDates = (numberOfMonthsRequired) => {
	//initialise an array to hold dates of months and year(s) to check for crimes
	let dateArray = [];

	//get current year in 4-digit format
	let currentYear = new Date().getFullYear();

	//get current month as int with no leading zero
	let currentMonth = new Date().getMonth() + 1; //zero indexed

	//initialise variable to hold month to check for crimes
	let crimeMonth = 0;

	//initialise variable to hold full date to check for crimes
	let crimeDateToCheck = "";

	/**
	 * Set initial crime month to 2 months prior,
	 * since the past 1-2 month's crimes are not usually listed on police API.
	 */
	if (currentMonth === 1) {
		// January special case
		crimeMonth = 11; // set crime month to Nov (2 months prior)
		currentYear--; // decrement year
	} else if (currentMonth === 2) {
		// February special case
		crimeMonth = 12; // set crime month to December (2 months prior)
		currentYear--; // decrement year
	} else {
		// decrement month by 2
		crimeMonth = currentMonth - 2;
	}

	//if month is single digit, add leading zero and store as format YYYY-MM
	if (crimeMonth < 10) {
		crimeDateToCheck = currentYear + "-0" + crimeMonth; //add leading zero to month value
	} else {
		crimeDateToCheck = currentYear + "-" + crimeMonth; //leading zero not required
	}

	//push date to array of all dates to check
	dateArray.push(crimeDateToCheck);

	//decrement number of months counter
	numberOfMonthsRequired--;

	//while more dates are required, loop until the required months have been added
	while (numberOfMonthsRequired > 0) {
		//decrement current crime month by 1
		crimeMonth--;

		//if current month is now zero ((Jan - 1 = 0), set to December and decrement year
		if (crimeMonth === 0) {
			crimeMonth = 12; //set crime month to December
			currentYear--; //decrement year
		}

		//if month is single digit month, add leading zero and store as format YYYY-MM
		if (crimeMonth < 10) {
			crimeDateToCheck = currentYear + "-0" + crimeMonth;

			//else don't add leading zero
		} else {
			crimeDateToCheck = currentYear + "-" + crimeMonth;
		}

		//push date to array of all dates to check
		dateArray.push(crimeDateToCheck);

		//decrement number of months required counter
		numberOfMonthsRequired--;
	}

	//return array of all dates to check for crimes
	return dateArray;
};

module.exports = { getYearAndMonth, populateCrimeDates, getMonthName};
