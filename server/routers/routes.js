const router = require ('express').Router ();
const mapquest = require ('mapquest'); // Mapquest
const axios = require ('axios');
mapquest.key = process.env.MAPQUEST_API_KEY;

/**
 * Returns an array of latitude and longitutde coordinates 
 * forming a 1 mile square bounding box centered on 
 * a pair of lat and lon coordinates.
 *
 * @param {Number} latLocation
 * @param {Number} lonLocation
 *
 * @return {Array} boundingBox
 */
const getBoundingBox = (latLocation, lonLocation) => {
  var boundingBox = []; //initialise array to hold bounding box coordinates
  const latCorrection = 0.004; //offset adjustment for latitude coordinate
  const lonCorrection = 0.009; //offset adjustment for longitude coordinate
  const precision = 6; //significant figures accuracy for Lat, lon coordinates

  //top left coordinate of bounding box
  const latTopLeft = parseFloat (latLocation + latCorrection).toPrecision (
    precision
  );
  const lonTopLeft = parseFloat (lonLocation - lonCorrection).toPrecision (
    precision
  );

  //bottom right coordinate of bounding box
  const latBotRight = parseFloat (latLocation - latCorrection).toPrecision (
    precision
  );
  const lonBotRight = parseFloat (lonLocation + lonCorrection).toPrecision (
    precision
  );

  //top right coordinate of bounding box
  const latTopRight = parseFloat (latLocation + latCorrection).toPrecision (
    precision
  );
  const lonTopRight = parseFloat (lonLocation + lonCorrection).toPrecision (
    precision
  );

  //bottom left coordinate of bounding box
  const latBotLeft = parseFloat (latLocation - latCorrection).toPrecision (
    precision
  );
  const lonBotLeft = parseFloat (lonLocation - lonCorrection).toPrecision (
    precision
  );

  //add bounding box coordinates to array of bounding box coordinates
  boundingBox.push (
    latTopLeft,
    lonTopLeft,
    latBotRight,
    lonBotRight,
    latTopRight,
    lonTopRight,
    latBotLeft,
    lonBotLeft
  );

  //return bounding box coordinates
  return boundingBox;
};

//function which returns the latitude and longitude of a named UK street location
const getGeocode = async locationName => {
  //declare array to hold results
  var geoCoords = {};

  //API key
  const apiKey = process.env.MAPQUEST_API_KEY;

  //construct base URL
  const baseURL = 'http://open.mapquestapi.com/geocoding/v1/address?key=';

  //construct final URL
  const URLGeocode = baseURL + apiKey + '&location=' + locationName + ',UK';

  //async call to mapquest geocode API with URL
  await axios
    .get (URLGeocode)
    .then (function (res) {
      //TODO check for not found location etc is there an error code?
      // console.log (res.data);

      //record returned latitude and longitude coordinates for named location
      const latitude = res.data.results[0].locations[0].displayLatLng.lat;
      const longitude = res.data.results[0].locations[0].displayLatLng.lng;

      //create results object for geo coordinates
      geoCoords = {
        latitude: latitude,
        longitude: longitude,
      };
    })
    .catch (error => {
      // console.log ('error getting crime data: ', error);
    });

  //return coords object;
  return geoCoords;
};

/** Function which returns an array of dates in the format YYYY-MM 
 * for a given number of prior months, begining 1 month prior
 * to current month, since current months are not recorded.   
 * 
 * @param int The number of months to check for crimes
 * @return array dateArray The array of dates to check for crimes  
 */
const populateCrimeDates = numberOfMonthsRequired => {
  //initialise an array to hold dates of months and year(s) to check for crimes
  let dateArray = [];

  //get current year in 4-digit format
  let currentYear = new Date ().getFullYear ();

  //get current month as int with no leading zero
  let currentMonth = new Date ().getMonth ();

  //initialise variable to hold month to check for crimes
  let crimeMonth = 0;

  //initialise variable to hold full date to check for crimes
  let crimeDateToCheck = '';

  /** 
   * Set initial crime month to the previous month,
   * since the current month's crimes are not usually listed. 
   */
  //change month to previous month
  if (currentMonth === 1) {
    //January special case
    crimeMonth = 12; // Set crime month to December
    currentYear--; // Decrement year
  } else {
    //just decrement month by 1
    crimeMonth = currentMonth--;
  }

  //if month is single digit, add leading zero and store as format YYYY-MM
  if (crimeMonth < 10) {
    crimeDateToCheck = currentYear + '-0' + crimeMonth; //add leading zero to month value
    console.log (
      'crimeDateToCheck less than 10 changed to : ' + crimeDateToCheck
    );
  } else {
    crimeDateToCheck = currentYear + '-' + crimeMonth; //leading zero not required
    console.log ('crimeDateToCheck greater than 10 now: ' + crimeDateToCheck);
  }

  //push date to array of all dates to check
  dateArray.push (crimeDateToCheck);

  //decrement number of months counter
  numberOfMonthsRequired--;

  //while more dates are required, loop until the required months have been added
  while (numberOfMonthsRequired > 0) {
    //decrement current crime month by 1
    crimeMonth--;

    //if current month is now zero, set to December and decrement year
    if (crimeMonth === 0) {
      crimeMonth = 12; //set crime month to December
      currentYear--; //decrement year
    }

    //if month is single digit month, add leading zero and store as format YYYY-MM
    if (crimeMonth < 10) {
      crimeDateToCheck = currentYear + '-0' + crimeMonth;

      //else don't add leading zero
    } else {
      crimeDateToCheck = currentYear + '-' + crimeMonth;
    }

    //push date to array of all dates to check
    dateArray.push (crimeDateToCheck);

    //decrement number of months required counter
    numberOfMonthsRequired--;
  }

  //return array of all dates to check for crimes
  return dateArray;
};

//function which returns a static map image URL containing crime locations centered at latLocation, lonLocation
const getMap = (boundingBox, crimeNodes, latLocation, lonLocation) => {
  //define base URL
  let URLMap =
    'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&boundingBox=';

  //get reference to bounding box lat and lon coordinates
  const latTopLeft = boundingBox[0];
  const lonTopLeft = boundingBox[1];
  const latBotRight = boundingBox[2];
  const lonBotRight = boundingBox[3];

  //declare variables to hold specific crime types display options
  let category = '';
  let colour = '';
  let symbol = '';

  //add bounding box coordinates, center point and center marker to base URL string
  URLMap =
    URLMap +
    latTopLeft +
    ',' +
    lonTopLeft +
    ',' +
    latBotRight +
    ',' +
    lonBotRight +
    '&locations=' +
    latLocation +
    ',' +
    lonLocation +
    '|marker-7B0099'; //center point marker

  //iterate through array of all crime records and add lat, lon, crime category and map marker to URL string
  for (const aCrimeRecord of crimeNodes) {
    // Set specific display and URL format options based on crime type found
    //TODO If no crimes - just add center marker and message no crimes of type
    switch (aCrimeRecord.category) {
      //anti-social
      case 'anti-social-behaviour':
        category = 'Anti';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //criminal-damage and arson
      case 'criminal-damage-arson':
        category = 'Arsn';
        colour = 'FF0000';
        symbol = 'flag-sm-';
        break;
      //generalised public order
      case 'public-order':
      case 'other-crime':
        category = 'Ordr';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //violent Crime
      case 'violent-crime':
      case 'theft-from-the-person':
        category = 'Viol';
        colour = 'FF0000';
        symbol = 'flag-sm-';
        break;
      //weapons
      case 'possession-of-weapons':
        category = 'Weapn';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //shoplifting
      case 'shoplifting':
        category = 'Shop';
        colour = '00FF00';
        symbol = 'flag-sm-';
        break;
      //general Theft
      case 'other-theft':
      case 'bicycle-theft':
        category = 'Theft';
        colour = '00FF00';
        symbol = 'flag-sm-';
        break;
      //vehicle Crime
      case 'vehicle-crime':
        category = 'Vehic';
        colour = '3B5998-22407F';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //robbery
      case 'robbery':
        category = 'Robber';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //drugs
      case 'drugs':
        category = 'Drugs';
        colour = 'FFFF00';
        symbol = 'flag-sm-';
        break;
      //burglary
      case 'burglary':
        category = 'Burg';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;

      default:
        //TODO some default symbol for uncarterognised version ***
        break;
    }
    //construct additional URL string for current crime
    URLMap =
      URLMap +
      '||' +
      aCrimeRecord.latitude +
      ',' +
      aCrimeRecord.longitude +
      '|' +
      symbol +
      colour +
      '-' +
      category;
  }

  //add URL ending string
  URLMap = URLMap + '&zoom=8&size=600,650@2x'; //TODO zoom lower = closer,  width,length

  //return full URL for a static map with all crime locations marked
  return URLMap;
};

//function which returns crime data for a spcific month at
//an approx 1 mile box at a geographical location  //TODO maybe change to center point rather than bounding
const getCrimeData = async (crimeDateCheck, boundingBox) => {
  // Set lat and lon coordinates of bounding box
  let latTopLeft = boundingBox[0];
  let lonTopLeft = boundingBox[1];
  let latBotRight = boundingBox[2];
  let lonBotRight = boundingBox[3];
  let latTopRight = boundingBox[4];
  let lonTopRight = boundingBox[5];
  let latBotLeft = boundingBox[6];
  let lonBotLeft = boundingBox[7];

  let crimeData;

  //base URL for polygon search of police API
  let baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly=';

  //generate URL for API
  let URLCrimes =
    baseURL +
    latTopLeft +
    ',' +
    lonTopLeft +
    ':' +
    latBotRight +
    ',' +
    lonBotRight +
    ':' +
    latTopRight +
    ',' +
    lonTopRight +
    ':' +
    latBotLeft +
    ',' +
    lonBotLeft +
    '&date=' +
    crimeDateCheck;

  await axios
    .get (URLCrimes)
    .then (res => {
      // console.log(res.data); //TEST
      if (res.length === 0) {
        console.log ('Empty response from crime data');
      }
      crimeData = res.data;
    })
    .catch (error => {
      console.log ('error retrieving crime data: ', error);
    });

  // Return the data
  return crimeData;
};

//function which randomly shuffles an array contents using the Fisher-Yates alogrithm
/**
 * Shuffles the contents of an array in place.
 * @param {Array} An array of elements.
 */
const shuffleArray = anArray => {
  var x, j, index;
  for (index = anArray.length - 1; index > 0; index--) {
    j = Math.floor (Math.random () * (index + 1));
    x = anArray[index];
    anArray[index] = anArray[j];
    anArray[j] = x;
  }
  return anArray;
};

//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; //boolean flag to determine if location name search
  var mapURL = ''; //static map image URL
  var location = ''; //variable to hold location
  var crimes = [];
  var noCrimes = false;

  const namedLocation = req.body.namedlocation;
  let latitude = req.body.lat;
  let longitude = req.body.lat;
  const numberOfMonths = req.body.numberofmonths;

  //named location search used
  if (isNameSearch) {
    //call function to convert named location to a set of lat and lon coordinates
    const geoCoords = await getGeocode (namedLocation);
    latitude = geoCoords.latitude; //store returned lat coordinate
    longitude = geoCoords.longitude; //store returned lon coordinate
  } else {
    //a latitude and longitude search was performed with coords input by user
    //get latitude and longitude from request body
    latitude = req.body.lat;
    longitude = req.body.lon;
  }

  //call method to get bounding box lat and lon coordinates of area centered on latitude and longitude
  const boundingBox = getBoundingBox (latitude, longitude);

  //populate array with all dates to check
  var crimeMonthsArray = populateCrimeDates (numberOfMonths); //TEST

  //TODO -----------------
  //array to hold crimes to display on map
  let slicedCrimes = [];
  let crimesDuringMonth = [];

  //get crime data for location for all months required
  for (let aMonth of crimeMonthsArray) {
    crimesDuringMonth = await getCrimeData (aMonth, boundingBox);

    //if crimes exist for month being checked, add them to collection of crimes
    if (crimesDuringMonth.length > 0) {      
      crimes.push (crimesDuringMonth);
    } 
  }

  //declare crime variables#
  //TODO crimes array might do the job of crimeNodes - willl depend on what machine learning needs
  let crimeNodes = []; //array to hold all found crime locations and information
  let displayCrimes = []; //array to hold only unique crime types and locations for map display

  //add category, and lat and lon locations for each crime
  for (let crimeCollection of crimes) {
    for (let aCrime of crimeCollection) {
      console.log ('STREET ------------ ' + aCrime.location.street.name);
      //store details of current crime
      let aCrimeCategory = aCrime.category;
      let aCrimeLat = aCrime.location.latitude;
      let aCrimeLon = aCrime.location.longitude;
      let aCrimeStreet = aCrime.location.street.name;
      let aCrimeMonth = aCrime.month;

      //TODO list of filters selected to display ---- TEST - get filters from UI
      const filters = [
        'vehicle-crime',
        'anti-social-behaviour',
        'violent-crime',
        'shoplifting',
        'other-crime',
        'public-order',
        'possession-of-weapons',
        'other-theft',
        'burglary',
        'robbery',
        'theft-from-the-person',
        'criminal-damage-arson',
        'bicycle-theft',
        'drugs',
      ];

      //TODO implement filters from interface
      // Filter crimes to include only user selected crime filters
      for (let aFilter of filters) {
        if (aCrimeCategory === aFilter) {
          //create new object with crime details to add
          const aCrimeDetails = {
            category: aCrimeCategory,
            latitude: aCrimeLat,
            longitude: aCrimeLon,
            street: aCrimeStreet,
            month: aCrimeMonth,
          };

          //TODO for machine learning save full crime data records to master record array
          crimeNodes.push (aCrimeDetails); //add crime to master record of all crimes

          //record only unique crime categories and locations for map display efficiency
          let filteredCrimeNodes = displayCrimes.filter (
            crime =>
              crime.category !== aCrimeCategory ||
              crime.latitude !== aCrimeLat ||
              crime.longitude !== aCrimeLon
          );

          //set crimeNodes to filtered crimeNodes
          displayCrimes = filteredCrimeNodes;

          //add current crime to array of all crimes to display on map
          displayCrimes.push (aCrimeDetails);
        }
      }
    }
  }

  //randomise crime order
  displayCrimes = shuffleArray (displayCrimes);

  //store max of 90 crimes to cater to mapquest marker quantity imposed limit
  slicedCrimes = displayCrimes.slice (0, 90);

  //TODO test
  console.log (
    'Total number of crimes included in map: ' + slicedCrimes.length
  );

  //if no crimes were found, set boolean flag
  if (slicedCrimes.length === 0) {
    noCrimes = true; //TODO send message back if no crimes found to allow user alert in results page
  }

  //call function which generates image URL with crime markers on map
  mapURL = getMap (boundingBox, slicedCrimes, latitude, longitude);

  //TODO call machine learning functions with master record of crimes
  //TODO e.g. machineLearning(crimeNodes);

  //respond with data //TODO don't need as much response data once finalised
  res.send ({
    location: location,
    namedlocation: namedLocation,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    mapurl: mapURL,
    numberofmonths: numberOfMonths,
    boundingbox: boundingBox,
    nocrimes: noCrimes,
  });
});

module.exports = router;
