/**
 * Function which converts a month number into the string name equivalent
 * @param {aMonthNumber} the number of the month
 * @returns {string} The name of the month
 */

export const getMonthName = (aMonthNumber) => {
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
