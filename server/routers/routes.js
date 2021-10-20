const router = require ('express').Router ();
const mapquest = require ('mapquest');
const axios = require ('axios');

mapquest.key = process.env.MAPQUEST_API_KEY;

/**
 * Returns an array of latitude and longitutde coordinates 
 * forming approx 1 mile square bounding box centered on 
 * a pair of latitude and longitude coordinates.
 *
 * @param {string} latLocation The center point latitude coordinate
 * @param {string} lonLocation The center point longitude coordinate
 *
 * @return {array} Bounding box of map area
 */
const getBoundingBox = (latLocation, lonLocation) => {
  latLocation = parseFloat (latLocation);
  lonLocation = parseFloat (lonLocation);

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

/**   
 * function which returns the latitude and longitude of a named UK street location
 * 
 * @param {string} locationName The location name
 * 
 * @return {object} Object containing latitude and longitude
 */
const getLatLon = async locationName => {
  //declare array to hold results
  var geoLocationData = {};

  //API key
  const apiKey = process.env.MAPQUEST_API_KEY;

  //construct base URL
  const baseURL = 'http://open.mapquestapi.com/geocoding/v1/address?key=';

  //construct final URL
  const URLGeocode = baseURL + apiKey + '&location=' + locationName + ',UK';

  let latitude;
  let longitude;

  //async call to mapquest geocode API with URL
  await axios
    .get (URLGeocode)
    .then (function (res) {
      //record returned latitude, longitude coordinates
      latitude = res.data.results[0].locations[0].displayLatLng.lat;
      longitude = res.data.results[0].locations[0].displayLatLng.lng;
    })
    .catch (error => {
      console.log (
        'error getting geocoding lat lon data for location name: ',
        error
      );
    });

  //create results object for geo coordinates
  geoLocationData = {
    latitude: latitude,
    longitude: longitude,
  };

  //return coords object;
  return geoLocationData;
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
const populateCrimeDates = numberOfMonthsRequired => {
  //initialise an array to hold dates of months and year(s) to check for crimes
  let dateArray = [];

  //get current year in 4-digit format
  let currentYear = new Date ().getFullYear ();

  //get current month as int with no leading zero
  let currentMonth = new Date ().getMonth () + 1; //zero indexed

  //initialise variable to hold month to check for crimes
  let crimeMonth = 0;

  //initialise variable to hold full date to check for crimes
  let crimeDateToCheck = '';

  /** 
   * Set initial crime month to 2 months prior,
   * since the past 1-2 month's crimes are not usually listed on police API. 
   */
  if (currentMonth === 1) {
    //January special case
    crimeMonth = 11; //set crime month to Nov (2 months prior)
    currentYear--; //decrement year
  } else if (currentMonth === 2) {
    //February special case
    crimeMonth = 12; //set crime month to December (2 months prior)
    currentYear--; //decrement year
  } else {
    //just decrement month by 2
    crimeMonth = currentMonth - 2;
  }

  //if month is single digit, add leading zero and store as format YYYY-MM
  if (crimeMonth < 10) {
    crimeDateToCheck = currentYear + '-0' + crimeMonth; //add leading zero to month value
  } else {
    crimeDateToCheck = currentYear + '-' + crimeMonth; //leading zero not required
  }

  //push date to array of all dates to check
  dateArray.push (crimeDateToCheck);

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

/**   
 * function which returns a static map image URL containing 
 * crime locations centered at latLocation, lonLocation
 * 
 * @param {array} boundingBox The bounding box coordinates of map area
 * @param {array} crimeNodes All crime locations and type within map area
 * @param {string} latLocation The latitude of center point of map area
 * @param {string} lonLocation The longitude of center point of map area
 * 
 * @return {string} The URL of static map image with crime markers for each crime and center point  
 */
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

  // iterate through array of all crime records and add lat, lon, crime category and map marker to URL string
  for (const aCrimeRecord of crimeNodes) {
    // set specific display and URL format options based on crime type
    switch (aCrimeRecord.category) {
      // anti-social
      case 'anti-social-behaviour':
        category = 'Anti';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;     
      // burglary
      case 'burglary':
        category = 'Burg';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      // criminal damage and arson
      case 'criminal-damage-arson':
        category = 'Arsn';
        colour = 'FF0000';
        symbol = 'flag-sm-';
        break;
      // drugs
      case 'drugs':
        category = 'Drugs';
        colour = 'FFFF00';
        symbol = 'flag-sm-';
        break;
      // general public order
      case 'other-crime':
      case 'public-order':
        category = 'Order';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      // weapons
      case 'possession-of-weapons':
        category = 'Weapn';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;     
      // shoplifting
      case 'shoplifting':
        category = 'Shop';
        colour = '00FF00';
        symbol = 'flag-sm-';
        break;
      // general Theft
      case 'bicycle-theft':
      case 'other-theft':
      case 'theft-from-the-person':
        category = 'Theft';
        colour = '00FF00';
        symbol = 'flag-sm-';
        break;
      // vehicle Crime      
      case 'vehicle-crime':
        category = 'Vehic';
        colour = '3B5998-22407F';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      // violent Crime
      case 'violent-crime':      
      case 'robbery':
         category = 'Viol';
         colour = 'FF0000';
         symbol = 'flag-sm-';
         break;

      default:
        //intentially blank
        break;
    }

    // construct URL string for current crime
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

  // add standard URL string ending
  URLMap = URLMap + '&zoom=8&size=600,500@2x'; //TODO NOTE: zoom=lower value=closer,  size=width,length

  // return full URL for a static map with all crime locations marked
  return URLMap;
};

/**   
 * Function which returns crime data for a spcific month 
 * within a lat/lon bounding box geographical area
 * 
 * @param {string} crimeDateCheck The month to check for recorded crimes
 * @param {array} boundingBox The map area bounding box coordinates to check for crimes
 * 
 * @return {array} crime data for all crimes commited within bounding box map area for a given month  
 */
const getCrimeData = async (crimeDateCheck, boundingBox) => {
  // get reference to lat and lon coordinates of bounding box
  let latTopLeft = boundingBox[0];
  let lonTopLeft = boundingBox[1];
  let latBotRight = boundingBox[2];
  let lonBotRight = boundingBox[3];
  let latTopRight = boundingBox[4];
  let lonTopRight = boundingBox[5];
  let latBotLeft = boundingBox[6];
  let lonBotLeft = boundingBox[7];

  // variable to hold crime data
  let crimeData;

  // base URL for geographical location polygon search of police crime data API
  let baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly=';

  // generate URL for API with bounding box area, and crime month required
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

  // call police data API to retieve crimes for specified month and area
  await axios
    .get (URLCrimes)
    .then (res => {
      if (res.length === 0) {
        console.log ('no crimes for this search');
      }
      crimeData = res.data;
    })
    .catch (error => {
      console.log ('error retrieving crime data: ', error);
    });

  // Return the crime data
  return crimeData;
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

// function which return the geographical sector for a given police force
const getSector = aPoliceForce => {
  var sector;

  switch (aPoliceForce) {
    //SECTOR 1: northumbria, durham, cleveland
    case 'northumbria':
    case 'durham':
    case 'cleveland':       
      sector = 'Sector1';
      break;

    //SECTOR 2: cumbria, lancashire
    case 'cumbria':
    case 'lancashire':
      sector = 'Sector2';
      break;

    //SECTOR 3: north-yorkshire, west-yorkshire
    case 'north-yorkshire':
    case 'west-yorkshire':
      sector = 'Sector3';
      break;

    //SECTOR 4: humberside, south-yorkshire
    case 'humberside':
    case 'south-yorkshire':
      sector = 'Sector4';
      break;

    //SECTOR 5: merseyside, cheshire
    case 'merseyside':
    case 'cheshire':
      sector = 'Sector5';
      break;

    //SECTOR 6: greater-manchester
    case 'greater-manchester':
      sector = 'Sector6';
      break;

    //SECTOR 7: derbyshire, nottinghamshire, lincolnshire, leicestershire, northamptonshire
    case 'derbyshire':
    case 'nottinghamshire':
    case 'lincolnshire':
    case 'leicestershire':
    case 'northamptonshire':
      sector = 'Sector7';
      break;

    //SECTOR 8: west-mercia, staffordshire, west-midlands, warwickshire
    case 'west-mercia':    
    case 'staffordshire':
    case 'west-midlands':
    case 'warwickshire':
      sector = 'Sector8';
      break;

    //SECTOR 9: gloucestershire, avon-and-sumerset, devon-and-cornwall
    case 'gloucestershire':
    case 'avon-and-sumerset':
    case 'devon-and-cornwall':    
      sector = 'Sector9';
      break;

    //SECTOR 10: wiltshire, dorset, hampshire (including isle of wight)
    case 'wiltshire':
    case 'dorset':
    case 'hampshire':
      sector = 'Sector10';
      break;

    //SECTOR 11: thames-valley, hertfordshire, bedforshire
    case 'thames-valley':
    case 'hertfordshire':
    case 'bedforshire':
      sector = 'Sector11';
      break;

    //SECTOR 12: cambridgeshire, norfolk, suffolk, essex
    case 'cambridgeshire':
    case 'norfolk':
    case 'suffolk':
    case 'essex':
      sector = 'Sector12';
      break;

    //SECTOR 13: surrey, sussex, kent
    case 'surrey':
    case 'sussex':
    case 'kent':
      sector = 'Sector13';
      break;

    //SECTOR 14: city-of-london, metropolitan 
    case 'city-of-london': 
    case 'metropolitan':
      sector = 'Sector14';
      break;

    default:
      //intentially blank
      break;
  }
  return sector;
};

/**
 * Function which returns the name of the police force for the current search lat and lon  
 * 
 * @param {string} aLatitude The lat for the prediction
 * @param {string} aLongitude The lon for the prediction
 * 
 * @return {string} The name of police force for current search location 
 */
const getPoliceForce = async (aLatitude, aLongitude) => {
  var aPoliceForce; // name of police force

  const baseURL = 'https://data.police.uk/api/locate-neighbourhood?q=';

  let URLSector = baseURL + aLatitude + ',' + aLongitude;

  // call police data API to retieve police force responsible for location lat/lon
  await axios
    .get (URLSector)
    .then (res => {
      if (res.length === 0) {
        console.log ('No police force assigned (location likely outside England)');
      }
      aPoliceForce = res.data.force; //e.g. {"force":"north-yorkshire","neighbourhood":"york-inner"}
    })
    .catch (error => {
      console.log ('error retrieving police force sector: ', error);
    });

  return aPoliceForce;
};


/**
 * Function which extracts the year and month from a string and returns
 * a Date object representation  
 * 
 * @param {string} stringDate String representation of year and month
 * 
 * @return {Date} The date object containing year and month of crime 
 */
 const getYearAndMonth = stringDate => {
  const crimeYear = stringDate.slice (0, 4);
  const crimeMonth = stringDate.slice (5);
  const crimeDate = new Date (crimeYear, crimeMonth);

  return crimeDate;
};


//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; //boolean if name search
  const locationName = req.body.locationname; //the name of location searched
  const numberOfMonths = req.body.numberofmonths; //number of months searched
  let latitude = req.body.lat; //latitude searched for
  let longitude = req.body.lon; //longitude searched for
  let filters = []; //to hold crime filters
  var mapURL = ''; //static map image URL
  var location = ''; //variable to hold location
  var crimes = []; //array to hold crime data
  var noCrimes = false; //if no crimes found

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
  let slicedCrimes = []; //array to hold all crimes to display on map
  let crimesDuringMonth = []; //array to hold a specific month's crimes
  // get crime data for location for all months required
  for (let aMonth of monthsToCheck) {
    crimesDuringMonth = await getCrimeData (aMonth, boundingBox);

    // if crimes exist for month being checked, add them to collection of crimes
    if (crimesDuringMonth !== undefined && crimesDuringMonth.length > 0) {
      crimes.push (crimesDuringMonth);
    }
  }


  //*************** HISTORIC CRIME DATA *************************
  var crimeMonthsArrayHistoric = populateCrimeDates (12);

  var crimesHistoric = [];
  let crimesDuringMonthHistoric = []; //array to hold a specific month's crimes

  // get crime data for location for all months required
  for (let aMonth of crimeMonthsArrayHistoric) {
    crimesDuringMonthHistoric = await getCrimeData (aMonth, boundingBox);

    // if crimes exist for month being checked, add them to collection of crimes
    if (
      crimesDuringMonthHistoric !== undefined &&
      crimesDuringMonthHistoric.length > 0
    ) {
      crimesHistoric.push (crimesDuringMonthHistoric);
    }
  }

  // declare crime variables
  let displayCrimesHistoric = []; // array to hold only unique crime types and locations for map display

  // add crime details for each crime
  for (let crimeCollection of crimesHistoric) {
    for (let aCrime of crimeCollection) {

      // store details of current crime
      let aCrimeCategory = aCrime.category;
      let aCrimeLat = aCrime.location.latitude;
      let aCrimeLon = aCrime.location.longitude;
      let aCrimeStreet = aCrime.location.street.name;
      let aCrimeDate = getYearAndMonth (aCrime.month);
      let aCrimeYear = aCrimeDate.getFullYear ();
      let aCrimeMonth = aCrimeDate.getMonth () + 1; //zero based count +1

      // reate new object with crime details to add
      const aCrimeDetails = {
        category: aCrimeCategory,
        latitude: aCrimeLat,
        longitude: aCrimeLon,
        street: aCrimeStreet,
        month: aCrimeMonth,      
        year: aCrimeYear,
      };     
      // add current crime to array of all crimes to display on map
      displayCrimesHistoric.push (aCrimeDetails);
    }
  }
  //TODO *************** END STORING HISTORIC **********************




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

        //add crime to master record of all crimes without filtering
        crimeNodes.push (aCrimeDetails);

        // record only unique crime categories and locations for map display efficiency
        let uniqueCrimeNodes = displayCrimes.filter (
          crime =>
            crime.category !== aCrimeCategory ||
            crime.latitude !== aCrimeLat ||
            crime.longitude !== aCrimeLon
        );

        // set crimeNodes to filtered crimeNodes
        displayCrimes = uniqueCrimeNodes;

        // add current crime to array of all crimes to display on map
        displayCrimes.push (aCrimeDetails);
      }
    }
  }

  // store max of 90 crimes, to cater to mapquest API map markers imposed limit
  slicedCrimes = displayCrimes.slice (0, 90);

  // if no crimes were found, set boolean flag to true
  if (slicedCrimes.length === 0) {
    noCrimes = true;
  }

  // call function which generates map image URL with crime markers
  mapURL = getMap (boundingBox, slicedCrimes, latitude, longitude);

  const today = new Date (); // get Date object
  const predictionYear = today.getFullYear (); // get current year
  const predictionMonth = today.getMonth () + 1; // get next month

  // variables to hold police force and sector for this search location
  var policeForce = await getPoliceForce (latitude, longitude);
  var sector = getSector (policeForce); // get name of police sector for this location

  // variable to hold response from machine learning flask server
  var flaskData;

  // call flask server API to get prediction data
  await axios
    .request ({
      method: 'POST',
      url: 'http://localhost:5000/predict',
      data: {
        month: predictionMonth, // the month to predict
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

  
   //TODO remove entries for test data 
  //respond with data 

    //TODO TEST 
   // console.log('\nReturning historic data: <><>< **************');
    //console.log(JSON.stringify(displayCrimesHistoric));

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
  });
});

module.exports = router;
