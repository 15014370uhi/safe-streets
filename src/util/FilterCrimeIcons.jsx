/**
 * Function which returns an array of all user selected crime filters to apply
 *
 * @param {array} filters All user selected filters
 *
 * @return {array} All the selected filters to apply to crimes
 */
const applyFilters = (filters) => {
	const allCategories = [
		"anti-social-behaviour",
		"burglary",
		"criminal-damage-arson",		
		"drugs",
		"possession-of-weapons",		
		"public-order",	
		"robbery",	
		"shoplifting",
		"theft",		
		"vehicle-crime",
		"violent-crime",
	];

	// if crime is not to be hidden, add to array of crimes to display
	const crimesToDisplay = allCategories.filter(
		(aCategory) => !filters.includes(aCategory)
	);
	// return array of crimes to include on map
	return crimesToDisplay;
};

// Function which creates an array of all crimes to be displayed on map
export const populateDisplayCrimes = (crimes, filters) => {
	var displayCrimes = [];

	// call function which creates a list of crime categories to display on map
	const categoriesToInclude = applyFilters(filters);

	crimes.forEach((aCrime) => {
		if (categoriesToInclude.includes(aCrime.category)) {
			displayCrimes.push(aCrime);
		}
	});

	// return list of crime categories to display on map
	return displayCrimes;
};
