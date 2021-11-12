const {
  getPoliceForce,
  getCrimeData,
  populateAllCrimes,
  getHistoricCrimes,
} = require ('../util/crime-data');
const {getLatLon, getBoundingBox, isWithinUK} = require ('../util/geo-data');
const {populateCrimeDates} = require ('../util/date-helpers');
const {getProbabilities} = require ('../util/getCrimePredictions');
const router = require ('express').Router ();

// route for a user search
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isNameSearch; // boolean if name search
  const locationName = req.body.locationName; // the name of location searched
  const numberOfMonths = req.body.numberOfMonths; // number of months searched
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for
  var crimes = []; // array to hold all crime data
  var noCrimes = false; // if no crimes found
  var allCrimes;
  var predictionData;

  // named location search used
  if (isNameSearch) {
    //call function to convert named location to a set of lat and lon coordinates
    var locationData = await getLatLon (locationName);
    latitude = locationData.latitude; // store lat coordinate of named location
    longitude = locationData.longitude; // store lon coordinate of named location
  }

  if (isWithinUK (latitude, longitude)) {
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
    var historicCrimes = await getHistoricCrimes (boundingBox);

    // array to hold all crimes to be displayed on map
    allCrimes = await populateAllCrimes (crimes);

    // if no crimes were found, set no crimes boolean flag to true
    if (allCrimes.length === 0) {
      noCrimes = true;
    }

    // get police force and sector number for this search location
    var policeForce = await getPoliceForce (latitude, longitude);

    // check for valid police force/location
    if (typeof policeForce !== 'undefined') {
      // get crime predictions for this location, for the following month
      var predictions = await getProbabilities (
        policeForce,
        latitude,
        longitude
      );
      console.log('PREDICTIONS: ' + JSON.stringify(predictions.data));
      predictionData = predictions.data;
    }
  }

  res.send ({
    allCrimes: allCrimes,
    predictions: predictionData,
    historicCrimes: historicCrimes,
    locationName: locationName,
    lat: latitude,
    lon: longitude,
    noCrimes: noCrimes,
    policeForce: policeForce,
  });
});

// route for only historic crime data
router.post ('/historic', async (req, res) => {
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for

  // call method to get bounding box coordinates for an area centered on latitude and longitude
  const boundingBox = getBoundingBox (latitude, longitude);

  // store previous 12 months of crime data
  var historicCrimes = await getHistoricCrimes (boundingBox);

  res.send ({
    historicCrimes: historicCrimes,
  });
});

// route for only machine learning crime predictions from flask server
router.post ('/predictions', async (req, res) => {
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for

  // get police force and sector number for this search location
  var policeForce = await getPoliceForce (latitude, longitude);

  // check for valid police force/location
  if (typeof policeForce !== 'undefined') {
    // get crime predictions for this location, for the following month
    var predictions = await getProbabilities (policeForce, latitude, longitude);
  }

  res.send ({
    predictions: predictions.data,
  });
});

module.exports = router;
