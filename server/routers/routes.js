const {
  getPoliceForce,
  getCrimeData,
  populateAllCrimes,
  getHistoricCrimes,
} = require ('../util/crime-data');
const {getMap, getLatLon, getBoundingBox} = require ('../util/geo-data');
const {populateCrimeDates} = require ('../util/date-helpers');
const {getProbabilities} = require ('../util/getCrimePredictions');
const router = require ('express').Router ();

//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isNameSearch; // boolean if name search
  const locationName = req.body.locationName; // the name of location searched
  const numberOfMonths = req.body.numberOfMonths; // number of months searched
  let latitude = req.body.lat; // latitude searched for
  let longitude = req.body.lon; // longitude searched for
  var crimes = []; // array to hold crime data
  var noCrimes = false; // if no crimes found

  console.log('Router received args> isNamed:' + JSON.stringify(req.body.isNameSearch));

  // named location search used
  if (isNameSearch) {    
    //call function to convert named location to a set of lat and lon coordinates
     var locationData = await getLatLon (locationName);    
     latitude = locationData.latitude; // store lat coordinate of named location    
     longitude = locationData.longitude; // store lon coordinate of named location
     console.log('latitude: ' + latitude + ' lon: ' + longitude);
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
  var historicCrimes = await getHistoricCrimes (boundingBox);

  // array to hold all crimes to be displayed on map
  let allCrimes = await populateAllCrimes (crimes);

  // if no crimes were found, set no crimes boolean flag to true
  if (allCrimes.length === 0) {
    noCrimes = true;
  }

  // call function which generates map image URL with crime markers
  //mapURL = getMap (boundingBox, allCrimes, latitude, longitude);

  // get police force and sector number for this search location
  var policeForce = await getPoliceForce (latitude, longitude);

  // check for valid police force/location
  if (typeof policeForce !== 'undefined') {

    // get crime predictions for this location, for the following month
    var predictions = await getProbabilities (policeForce, latitude, longitude);
  }

  
  res.send ({
    allCrimes: allCrimes,
    predictions: predictions,
    historicCrimes: historicCrimes,
    lat: latitude,
    lon: longitude,    
    noCrimes: noCrimes,
    policeForce: policeForce,
  });
});

module.exports = router;
