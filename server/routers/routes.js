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
 * 
 * @param {latitude} latitude 
 * @param {longitude} latitude 
 * 
 * @return {object} Object containing postcode and LSOA data
 */
const getGeoData = async (lat, lon) => {
  //declare array to hold results
  var geoData = {};

  //declare variable to hold postcode and
  let postcode;

  //API key
  const apiKey = process.env.MAPQUEST_API_KEY;

  //construct base URL
  const baseURL = 'http://www.mapquestapi.com/geocoding/v1/reverse?key=';

  //construct API options string
  const URLOptions =
    '&includeRoadMetadata=false&includeNearestIntersection=false';

  //construct final URL
  const URLGeocode =
    baseURL + apiKey + '&location=' + lat + ',' + lon + URLOptions;

  //async call to mapquest geocode API with URL
  await axios
    .get (URLGeocode)
    .then (function (res) {
      //record returned postcode for lat lon location
      postcode = res.data.results[0].locations[0].postalCode;
    })
    .catch (error => {
      console.log ('error getting postcode data from lat lon: ', error);
    });

  let LSOAData = await getLSOA (postcode);

  //create results object for geo data
  geoData = {
    postcode: postcode,
    lsoa: LSOAData.lsoa,
    lsoa_name: LSOAData.lsoa_name,
  };

  //return geoData object;
  return geoData;
};


/**   
 * function which returns the LSOA code for a postcode 
 * 
 * @param {string} locationName The location name
 * 
 * @return {string} LSOA code
 */
const getLSOA = async postcode => {
  //declare array to hold results
  var LSOA;
  var LSOA_name;
  var LSOAData = {};

  //construct base URL
  const baseURL = 'https://api.postcodes.io/postcodes/' + postcode;

  //async call to postcode API to get LSOA code from postcode
  await axios
    .get (baseURL)
    .then (function (res) {
      LSOA = res.data.result.codes.lsoa; //get LSOA code
      LSOA_name = res.data.result.admin_district; //get LSOA name

      LSOAData = {
        lsoa: LSOA,
        lsoa_name: LSOA_name,
      };
    })
    .catch (error => {
      console.log ('error retrieving LSOA code: ', error);
    });

  return LSOAData; //return LSOA result
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
  let currentMonth = new Date ().getMonth ();

  //initialise variable to hold month to check for crimes
  let crimeMonth = 0;

  //initialise variable to hold full date to check for crimes
  let crimeDateToCheck = '';

  /** 
   * Set initial crime month to the previous month,
   * since the current month's crimes are not usually listed. 
   */
  if (currentMonth === 1) {
    //January special case
    crimeMonth = 12; //set crime month to December
    currentYear--; //decrement year
  } else {
    //just decrement month by 1
    crimeMonth = currentMonth--;
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

  //iterate through array of all crime records and add lat, lon, crime category and map marker to URL string
  for (const aCrimeRecord of crimeNodes) {
    // Set specific display and URL format options based on crime type found
    switch (aCrimeRecord.category) { 

      //anti-social
      case 'anti-social-behaviour':
        category = 'Anti';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;

      //general Theft
      case 'bicycle-theft':
      case 'other-theft':
        category = 'Theft';
        colour = '00FF00';
        symbol = 'flag-sm-';
        break;

      //burglary
      case 'burglary':
        category = 'Burg';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;

      //criminal-damage and arson
      case 'criminal-damage-arson':
        category = 'Arsn';
        colour = 'FF0000';
        symbol = 'flag-sm-';
        break;

      //drugs
      case 'drugs':
        category = 'Drugs';
        colour = 'FFFF00';
        symbol = 'flag-sm-';
        break;

      //generalised public order
      case 'other-crime':
      case 'public-order':
        category = 'Other';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;

      //weapons
      case 'possession-of-weapons':
        category = 'Weapn';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;

      //violent Crime
      case 'violent-crime':
      case 'theft-from-the-person':
      case 'robbery':
        category = 'Viol';
        colour = 'FF0000';
        symbol = 'flag-sm-';
        break;

      //shoplifting
      case 'shoplifting':
        category = 'Shop';
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

      default:
        //intentially blank
        break;
    }
    // construct additional URL string for current crime
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

  // add URL ending string
  URLMap = URLMap + '&zoom=8&size=600,400@2x'; //TODO NOTES: zoom=lower value is closer,  size=width,length
// URLMap = URLMap + '&zoom=8&size=600,600@2x'; //TODO NOTES: zoom=lower value is closer,  size=width,length


  // return full URL for a static map with all crime locations marked
  return URLMap;
};


/**   
 * Function which returns crime data for a spcific month 
 * within a bounding box map area for a geographical location
 * 
 * @param {string} crimeDateCheck The month to check for recorded crimes
 * @param {array} boundingBox The map area bounding box coordinates to check for crimes
 * 
 * @return {array} crime data for all crimes commited within bounding box map area for a given month  
 */
const getCrimeData = async (crimeDateCheck, boundingBox) => {

  // set lat and lon coordinates of bounding box
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

  // base URL for polygon search of police API
  let baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly=';

  // generate URL for API with bounding box area and month
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

  // Return the data
  return crimeData;
};


/** 
 * Function which randomly shuffles an array of crime data 
 * using the Fisher-Yates alogrithm
 *
 * @param {Array} anArray The array of elements to shuffle.
 * 
 * @return {Array} The shuffled array of crime data 
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
    'public-order',
    'other-crime',
    'violent-crime',
    'theft-from-the-person',
    'possession-of-weapons',
    'shoplifting',
    'other-theft',
    'bicycle-theft',
    'vehicle-crime',
    'robbery',
    'drugs',
    'burglary',
  ];

  const categoriesToInclude = allCategories.filter (
    aCategory => !filters.includes (aCategory)
  );
  return categoriesToInclude;
};

  // function which return the geographical sector for a given police force
  const getSector = aPoliceForce => {
    var sector;

    switch (aPoliceForce) {

      //SECTOR 1: cleveland, cumbria, durham, lancashire, northumbria, north-yorkshire
      case 'cleveland':
      case 'cumbria':
      case 'durham':
      case 'lancashire':
      case 'northumbria':
      case 'north-yorkshire':
        sector = 'Sector1';
        break;

      //SECTOR 2: cheshire, derbyshire, greater manchester, humberside, lincolnshire, merseyside, nottinghamshire, south yorkshire, west yorkshire
      case 'cheshire':
      case 'derbyshire':
      case 'greater-manchester':
      case 'humberside':
      case 'lincolnshire':
      case 'merseyside':
      case 'nottinghamshire':
      case 'south-yorkshire':
      case 'west-yorkshire':
        sector = 'Sector2';
        break;

      //SECTOR 3: gloucestershire, leicestershire, northamptonshire, staffordshire, warwickshire, west mercia, west midlands
      case 'gloucestershire':
      case 'leicestershire':
      case 'northamptonshire':
      case 'staffordshire':
      case 'warwickshire':
      case 'west-mercia':
      case 'west-midlands':
        sector = 'Sector3';
        break;

      //SECTOR 4: bedfordshire, cambridgeshire, essex, hertfordshire, norfolk, suffolk, thames valley
      case 'bedfordshire':
      case 'cambridgeshire':
      case 'essex':
      case 'hertfordshire':
      case 'norfolk':
      case 'suffolk':
      case 'thames-valley':
        sector = 'Sector4';
        break;

      //SECTOR 5: city of london, metropolitan
      case 'city of london':
      case 'metropolitan':
        sector = 'Sector5';
        break;

      //SECTOR 6: wiltshire, sussex, surrey, kent, hampshire, dorset, devon and cornwall, avon and sumerset
      case 'wiltshire':
      case 'sussex':
      case 'surrey':
      case 'kent':
      case 'hampshire':
      case 'dorset':
      case 'devon-and-cornwall':
      case 'avon-and-sumerset':
        sector = 'Sector6';
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

    // call police data API to retieve crimes for specified month and area
    await axios
      .get (URLSector)
      .then (res => {
        if (res.length === 0) {
          console.log ('No sector for this search');
        }
        aPoliceForce = res.data.force; //e.g. {"force":"north-yorkshire","neighbourhood":"york-inner"}
      })
      .catch (error => {
        console.log ('error retrieving police sector: ', error);
      });

    //console.log ('=== police force ===  ' + aPoliceForce);

    return aPoliceForce;
  };


// ================================================================================

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
  var geoData = {}; //geo data object

  // if user has selected filters to apply
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

  // call method to get bounding box lat and lon coordinates of area centered on latitude and longitude
  const boundingBox = getBoundingBox (latitude, longitude);

  // populate array with all dates to check
  var crimeMonthsArray = populateCrimeDates (numberOfMonths);

  // array to hold crimes to display on map
  let slicedCrimes = []; //array to hold all crimes to display on map
  let crimesDuringMonth = []; //array to hold a specific month's crimes

  // get crime data for location for all months required
  for (let aMonth of crimeMonthsArray) {
    crimesDuringMonth = await getCrimeData (aMonth, boundingBox);

    // if crimes exist for month being checked, add them to collection of crimes
    if (crimesDuringMonth !== undefined && crimesDuringMonth.length > 0) {
      crimes.push (crimesDuringMonth);
    }
  }

  // declare crime variables
  //TODO crimes array might do the job of crimeNodes - willl depend on what machine learning needs
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
      let aCrimeMonth = aCrime.month;

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
            };

            //TODO================================------------------------------------------------------------//
            
            //TODO for machine learning save full crime data records to master record array
            crimeNodes.push (aCrimeDetails); //add crime to master record of all crimes
           
            //randomise crime order 
            // crimeNodes = shuffleArray (crimeNodes);


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
        };

        //TODO machine learning-=============================-------------------------------
        //add crime to master record of all crimes without filtering
        crimeNodes.push (aCrimeDetails); //TODO is needed? - may be able to remove the crimeNodes
        //TODO USE FOR Displaying trend data?????


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

  // store max of 90 crimes to cater to mapquest marker quantity imposed limit
  slicedCrimes = displayCrimes.slice (0, 90);

  // if no crimes were found, set boolean flag to true
  if (slicedCrimes.length === 0) {
    noCrimes = true;
  }

  // call function which generates map image URL with crime markers
  mapURL = getMap (boundingBox, slicedCrimes, latitude, longitude);


  //TODO ----------------  Machine learning --------------
  const today = new Date ();
  const predictionYear = today.getFullYear ();
  const predictionMonth = today.getMonth () + 1; 

  // variables to hold police force and sector for this search location
  var policeForce = await getPoliceForce (latitude, longitude);
  var sector = getSector (policeForce);

  // variable to hold response from machine learning flask server
  var flaskData;

  await axios
    .request ({
      method: 'POST',
      url: 'http://localhost:5000/predict',
      data: {
        month: predictionMonth,
        year: predictionYear,
        lat: latitude,
        lon: longitude,
        sector: sector,
      },
    })
    .then (response => {
      const allData = response.data;
      flaskData = {
        data: allData,
      };
    })
    .catch (error => {
      console.log ('Error getting response from flask: ' + error);
    });

  //respond with data //TODO don't need as much response data once finalised
  res.send ({
    flaskdata: flaskData, //TODO change name - and sort out this data being returned
    boundingbox: boundingBox,
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
