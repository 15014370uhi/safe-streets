const {
  getPoliceForce,
  getCrimeData,
  getSector,
  getHistoricData,
} = require ('../util/police-data');
const {
  getMap,
  getLatLon,
  getBoundingBox,
  improveMarkerVisibility,
} = require ('../util/geo-data');
const {getYearAndMonth, populateCrimeDates} = require ('../util/date-helpers');
const router = require ('express').Router ();
const mapquest = require ('mapquest');
const axios = require ('axios');

mapquest.key = process.env.MAPQUEST_API_KEY;

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

// Function which calls the flask server to obtain crime predictions for current area
const predictCrimes = async (
  predictionMonth,
  predictionYear,
  latitude,
  longitude,
  sector
) => {
  var flaskData;

  // call flask server API to get prediction data
  await axios
    .request ({
      method: 'POST',
      url: 'http://localhost:5000/predict',
      data: {
        month: predictionMonth, // the month to predict (current month + 1)
        year: predictionYear, // the year to predict
        lat: latitude, // the latitude of search location
        lon: longitude, // the longitude of search location
        sector: sector, // the name of police force sector
      },
    })
    .then (response => {
      const allData = response.data;
      flaskData = {
        data: allData, // store returned prediction data
      };
    })
    .catch (error => {
      console.log ('Error getting response from flask server: ' + error);
    });

  return flaskData;
};

//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; // boolean if name search
  const locationName = req.body.locationname; // the name of location searched
  const numberOfMonths = req.body.numberofmonths; // number of months searched
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for
  let filters = []; // to hold crime filters
  var mapURL = ''; // static map image URL
  var location = ''; // variable to hold location
  var crimes = []; // array to hold crime data
  var noCrimes = false; // if no crimes found

  // if user has selected filters to apply, store them
  if (req.body.filters !== undefined) {
    filters = req.body.filters;
  }

  // named location search used
  if (isNameSearch) {
    // call function to convert named location to a set of lat and lon coordinates
    var locationData = await getLatLon (locationName);
    latitude = locationData.latitude; // store lat coordinate of named location
    longitude = locationData.longitude; // store lon coordinate of named location
  }

  // call method to get bounding box coordinates for an area centered on latitude and longitude
  const boundingBox = getBoundingBox (latitude, longitude);

  // populate an array with all month dates to check for crimes
  var monthsToCheck = populateCrimeDates (numberOfMonths);

  // array to hold crimes to display on map
  let crimesDuringMonth = []; //array to hold a specific month's crimes

  // get crime data for location for all months required
  for (let aMonth of monthsToCheck) {
    crimesDuringMonth = await getCrimeData (aMonth, boundingBox);

    // if crimes exist for month being checked, add them to collection of crimes
    if (crimesDuringMonth !== undefined && crimesDuringMonth.length > 0) {
      crimes.push (crimesDuringMonth);
    }
  }

  // store previous 12 months of crime data
  var displayCrimesHistoric = await getHistoricData (boundingBox);

  // declare crime variables
  let crimeNodes = []; // array to hold all found crime locations and information
  let displayCrimes = []; // array to hold only unique crime types and locations for map display

  // add crime details for each crime
  for (let crimeCollection of crimes) {
    for (let aCrime of crimeCollection) {
      // store details of current crime
      let aCrimeCategory = aCrime.category;
      let aCrimeLat = aCrime.location.latitude;
      let aCrimeLon = aCrime.location.longitude;
      let aCrimeStreet = aCrime.location.street.name;
      let aCrimeDate = getYearAndMonth (aCrime.month);
      let aCrimeYear = aCrimeDate.getFullYear ();
      let aCrimeMonth = aCrimeDate.getMonth () + 1; //zero based count +1

      // if filters were selected
      if (filters.length > 0) {
        // console.log('FILTERS were found: ' + filters); //TODO TEST

        // call function which removes unwanted/unselected crime filters
        const categoriesToInclude = applyFilters (filters);

        for (let aCategory of categoriesToInclude) {
          if (aCrimeCategory === aCategory) {
            // create new object with crime details to add
            const aCrimeDetails = {
              category: aCrimeCategory,
              latitude: aCrimeLat,
              longitude: aCrimeLon,
              street: aCrimeStreet,
              month: aCrimeMonth,
              year: aCrimeYear,
            };

            crimeNodes.push (aCrimeDetails); //add crime to master record of all crimes

            // record only unique crime categories and locations for map display efficiency
            let uniqueCrimeNodes = displayCrimes.filter (
              crime =>
                crime.category !== aCrimeCategory ||
                crime.latitude !== aCrimeLat ||
                crime.longitude !== aCrimeLon
            );

            // set crimeNodes to filtered unique crimeNodes
            displayCrimes = uniqueCrimeNodes;

            // add current crime to array of all crimes to display on map
            displayCrimes.push (aCrimeDetails);
          }
        }
      } else {
        // no filters supplied to API, create new object with crime details to add
        const aCrimeDetails = {
          category: aCrimeCategory,
          latitude: aCrimeLat,
          longitude: aCrimeLon,
          street: aCrimeStreet,
          month: aCrimeMonth,
          year: aCrimeYear,
        };

        // add current crime to array of all crimes to display on map
        displayCrimes.push (aCrimeDetails);
      }
    }
  }

  // adjust crime marker locations to improve visibility
  displayCrimes = improveMarkerVisibility (displayCrimes);

  // if no crimes were found, set boolean flag to true
  if (displayCrimes.length === 0) {
    noCrimes = true;
  }

  // call function which generates map image URL with crime markers
  mapURL = getMap (boundingBox, displayCrimes, latitude, longitude);

  const today = new Date (); // get Date object
  const predictionYear = today.getFullYear (); // get current year
  const predictionMonth = today.getMonth () + 1; // get next month

  // get police force and sector number for this search location
  var policeForce = await getPoliceForce (latitude, longitude);
  var flaskData;

  // check for valid police force 
  if (typeof policeForce !== 'undefined') {   
    var sector = getSector (policeForce); // get name of police sector for this location
    
    if (typeof sector !== 'undefined') {
      // call flask server to get machine learning crime predictions for this area
       flaskData = await predictCrimes (
        predictionMonth,
        predictionYear,
        latitude,
        longitude,
        sector
      );
    }
  };

  

  res.send ({
    flaskdata: flaskData,
    boundingbox: boundingBox,
    historicdata: displayCrimesHistoric,
    filters: filters,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    location: location,
    locationname: locationName,
    mapurl: mapURL,
    numberofmonths: numberOfMonths,
    nocrimes: noCrimes,
    policeforce: policeForce,
  });
});

module.exports = router;
