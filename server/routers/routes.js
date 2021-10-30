const {
  getPoliceForce,
  getCrimeData,
  populateDisplayCrimes,
  getHistoricData,
} = require ('../util/crime-data');
const {getMap, getLatLon, getBoundingBox} = require ('../util/geo-data');
const {populateCrimeDates} = require ('../util/date-helpers');
const {getProbabilities} = require ('../util/getCrimePredictions');
const router = require ('express').Router ();

//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; // boolean if name search
  const locationName = req.body.locationname; // the name of location searched
  const numberOfMonths = req.body.numberofmonths; // number of months searched
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for
  let filters = []; // to hold crime filters
  var mapURL = ''; // static map image URL
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

  // get crime data for a bounding box location, for all specified months
  for (let aMonth of monthsToCheck) {
    crimesDuringMonth = await getCrimeData (aMonth, boundingBox);

    // if crimes exist for a month, add them to collection of crimes
    if (crimesDuringMonth !== undefined && crimesDuringMonth.length > 0) {
      crimes.push (crimesDuringMonth);
    }
  }

  // store previous 12 months of crime data 
  var displayCrimesHistoric = await getHistoricData (boundingBox);

  // array to hold all crimes to be displayed on map
  let displayCrimes = await populateDisplayCrimes (crimes, filters);

  // if no crimes were found, set no crimes boolean flag to true
  if (displayCrimes.length === 0) {
    noCrimes = true;
  }

  // call function which generates map image URL with crime markers
  mapURL = getMap (boundingBox, displayCrimes, latitude, longitude);

  // get police force and sector number for this search location
  var policeForce = await getPoliceForce (latitude, longitude);

  // check for valid police force/location
  if (typeof policeForce !== 'undefined') {

    // get crime predictions for this location, for the following month
    var predictions = await getProbabilities (policeForce, latitude, longitude);
  }

  res.send ({
    displaycrimes: displayCrimes,
    predictions: predictions,
    historicdata: displayCrimesHistoric,
    filters: filters,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    mapurl: mapURL,
    nocrimes: noCrimes,
    policeforce: policeForce,
  });
});

module.exports = router;
