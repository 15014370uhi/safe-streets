export const filterIcons = (crimes, filters) => {

  console.log ('filterIcons received CRIMES' + JSON.stringify(crimes) + ' \nFILTERS: ' + filters +'\n');
  var filteredCrimes;

  filteredCrimes = populateDisplayCrimes (crimes, filters);

  //console.log ('RETURNING filteredCrimes', JSON.stringify (filteredCrimes));

  return filteredCrimes;
};

/**
 * Function which returns an array of all user selected crime filters to apply
 * 
 * @param {array} filters All user selected filters
 * 
 * @return {array} All the selected filters to apply to crimes
 */
const applyFilters = filters => {
  const allCategories = [
    'anti-social-behaviour',
    'criminal-damage-arson',
    'burglary',
    'drugs',
    'theft',
    'public-order',
    'possession-of-weapons',
    'shoplifting',
    'violent-crime',
    'vehicle-crime',
  ];

  // if crime is not to be hidden, add to array of crimes to display
  const crimesToDisplay = allCategories.filter (
    aCategory => !filters.includes (aCategory)
  );

  // return array of crimes to include on map (not filtered)
  return crimesToDisplay;
};

// function which improves the visibility of overlapping and identically positioned
// map markers, by adding a small random offset value to latitude and longitude positions
// const improveMarkerVisibility = displayCrimes => {
//   console.log('improveMarkerVisibility CALLED');
//   var referenceLats = []; // to store duplicate latitudes
//   var referencelons = []; // to store duplicate longitudes

//   for (let aCrimeRecord of displayCrimes) {
//     referenceLats.push (aCrimeRecord.latitude);
//     referencelons.push (aCrimeRecord.longitude);
//   }

//   // get set of all unique crime latitudes
//   var uniqueLats = [...new Set (referenceLats)];

//   // get set of all unique crime longitudes
//   var uniqueLons = [...new Set (referencelons)];

//   // values to adjust crime marker location by
//   var locationValues = [
//     0.0001,
//     0.0002,
//     0.0003,
//     0.0004,   
//     -0.0001,
//     -0.0002,
//     -0.0003,
//     -0.0004,    
//   ];

//   //Iterate over all crimes - adjust the lat and lon of any duplicates so they show on map better
//   for (let aCrimeRecord of displayCrimes) {
//     if (uniqueLats.includes (aCrimeRecord.latitude)) {
//       var randomValue =
//         locationValues[Math.floor (Math.random () * locationValues.length)];
//       var newLatVal =
//         parseFloat (aCrimeRecord.latitude) + parseFloat (randomValue);
//       newLatVal = parseFloat (newLatVal).toPrecision (7);
//       aCrimeRecord.latitude = newLatVal;
//     }

//     if (uniqueLons.includes (aCrimeRecord.longitude)) {
//       randomValue =
//         locationValues[Math.floor (Math.random () * locationValues.length)];
//       var newLonVal =
//         parseFloat (aCrimeRecord.longitude) + parseFloat (randomValue);
//       newLonVal = parseFloat (newLonVal).toPrecision (5);
//       aCrimeRecord.longitude = newLonVal;
//     }
//   }

//   // store max of 90 crimes, to cater to mapquest API map markers imposed limit
//   //displayCrimes = displayCrimes.slice (0, 90);

//   return displayCrimes;
// };

// function which creates an array of all crimes to be displayed on map
const populateDisplayCrimes = (crimes, filters) =>
 {

  //console.log ('populateDisplayCrimes received: ', crimes);

  var displayCrimes = [];

  // call function which creates a list of crime categories to display on map
  const categoriesToInclude = applyFilters (filters);
  //console.log('categoriesToInclude: ', JSON.stringify(categoriesToInclude));

    crimes.forEach (aCrime => 
        {
            //console.log(aCrime.category);
            if(categoriesToInclude.includes(aCrime.category)){
                displayCrimes.push(aCrime);
               // console.log('ADDING crime: ' + aCrime);                
            }
        });


  // add crime details for each crime
  //for (let crimeCollection of crimes) {

//   for (let aCrime of crimes) {
//     console.log (
//       'Crime: ' +
//         aCrime.category +
//         '\n' +
//         aCrime.latitude +
//         '\n' +
//         aCrime.longitude
//     );

//     // get category of current crime
//     let aCrimeCategory = aCrime.category;
//     let aCrimeLat = aCrime.latitude;
//     let aCrimeLon = aCrime.longitude;
//     // let aCrimeDate = getYearAndMonth (aCrime.month);
//     // let aCrimeYear = aCrimeDate.getFullYear ();
//     // let aCrimeMonth = aCrimeDate.getMonth () + 1; //zero based count +1

//     for (let aCategory of categoriesToInclude) {
//       console.log (
//         'comparing aCategory: ' + aCategory + ' against: ' + aCrimeCategory
//       );
//       if (aCrimeCategory === aCategory) {
//         // create new object with crime details to add
//         const aCrimeDetails = {
//           category: aCrimeCategory,
//           latitude: aCrimeLat,
//           longitude: aCrimeLon,
//           // month: aCrimeMonth,
//           //  year: aCrimeYear,
//         };

//         // add current crime to array of all crimes to display on map
//         displayCrimes.push (aCrimeDetails);
//       }
//     }

    // adjust crime marker locations to improve visibility
    //displayCrimes = improveMarkerVisibility (displayCrimes);

    //console.log ('Returning displayCrimes: ', displayCrimes);
    return displayCrimes;
  };


