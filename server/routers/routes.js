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

  // Add bounding box coordinates to array of bounding box coordinates
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

// TEST return a static map image URL at a bounding box lat lon locatio
const testGetMap = boundingBox => {
  //define base URL
  let URLMap =
    'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&boundingBox=';

  //get reference to bounding box lat and lon coordinates
  const latTopLeft = boundingBox[0];
  const lonTopLeft = boundingBox[1];
  const latBotRight = boundingBox[2];
  const lonBotRight = boundingBox[3];

  //add bounding box lat and lon coordinates to base URL string
  URLMap +=
    latTopLeft + ',' + lonTopLeft + ',' + latBotRight + ',' + lonBotRight;

  //add url ending
  URLMap += '&zoom=16&size=550,420@2x'; //TODO TESTing taller map and zoomed closer

  // Return URL for static map with crime locations marked
  return URLMap;
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

  console.log ('CURRENT YEAR: ' + currentYear);

  //get current month as int with no leading zero
  let currentMonth = new Date ().getMonth ();

  console.log ('CURRENT MONTH: ' + currentMonth);

  //initialise variable to hold month to check for crimes
  let crimeMonth = 0;

  //initialise variable to hold full date to check for crimes
  let crimeDateToCheck = '';

  /** 
   * Set initial crime month to the previous month,
   * since the current month's crimes are not usually listed. 
   */
  console.log ('crimeMonth: ' + crimeMonth);
  //change month to previous month
  if (currentMonth === 1) {
    //January special case
    crimeMonth = 12; // Set crime month to December
    currentYear--; // Decrement year
  } else {
    //just decrement month by 1
    crimeMonth = currentMonth--;
  }

  console.log ('crimeMonth decremented to: ' + crimeMonth);

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

//TODO
// Function which returns a static map image URL containing crime locations centered at latLocation, lonLocation
const getMap = (boundingBox, crimeNodes, latLocation, lonLocation) => {
  //boolean to determine the initial lat and lon coordinates which are center point of map
  let isFirstLocation = true;

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

  //add bounding box lat and lon coordinates to base URL string
  URLMap =
    URLMap +
    latTopLeft +
    ',' +
    lonTopLeft +
    ',' +
    latBotRight +
    ',' +
    lonBotRight +
    '&locations=';

  //iterate through array of all crime records and add lat, lon, crime category and map marker to URL string
  for (const aCrimeRecord in crimeNodes) {
    // Set specific display and URL format options based on crime type found
    switch (aCrimeRecord['category']) {
      //general Disorder
      case 'anti-social-behaviour':
        category = 'Anti';
        colour = '7B0099';
        symbol = 'flag-sm-';
        break;
      //public Order Crimes
      case 'criminal-damage-arson':
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
      //general Theft
      case 'other-theft':
      case 'shoplifting':
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

    //if lat and lon coordinate is the center of search location marker
    if (isFirstLocation) {
      URLMap = URLMap + latLocation + ',' + lonLocation + '|marker-7B0099';
      isFirstLocation = false;
    } else {
      //construct URL section for current crime
      URLMap =
        URLMap +
        '||' +
        aCrimeRecord['latitude'] +
        ',' +
        aCrimeRecord['longitude'] +
        '|' +
        symbol +
        colour +
        '-' +
        category;
    }
  }

  //add URL ending string
  URLMap = URLMap + '&zoom=15&size=600,400@2x';

  //return full URL for a static map with all crime locations marked
  return URLMap;
};

//function which returns crime data for a spcific month at
//an approx 1 mile box at a geographical location
const getCrimeData = async (crimeDateCheck, boundingBox) => {
  console.log ('getCrimeData params: ' + crimeDateCheck + ' ' + boundingBox);
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

  // Base URL for polygon search of police API
  let baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly=';

  // Generate URL for API
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

  //console.log ('Final crime URL: ' + URLCrimes);

  await axios
    .get (URLCrimes)
    .then (res => {
      // console.log(res);
      // TEST response
      if (res.length === 0) { //TODO TEST
        console.log ('Empty response from crime data');
      }
      // console.log("RESPONSE DATA TEST ----------: " + JSON.stringify(res.data)); //TODO check for emtpy data here?

      crimeData = res.data;

      // crimeDataJSON = JSON.stringify(res);

      //console.log("crimeDataJSON \n");
      //console.log(crimeDataJSON);
    })
    .catch (error => {
      console.log ('error retrieving crime data: ', error);
    });

  // Return the data
  return crimeData; //TODO move to response section of axios?
};

//POST route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; // Boolean flag to determine if location name search
  var mapURL = ''; // Static map image URL
  var location = ''; // Variable to hold location
  var crimes = [];
  var noCrimes = false;

  // TEST
  //mapURL ='http://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';

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

  //TODO call function to get map URL
  //TODO - now have lat and lon coords of location - whether manually entered or
  //TODO or returned from function.
  // Now need to TEST - by getting map image using the coordinates
  // Then - TEST by getting the crime data for the months required - rem the two month thing

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
    // console.log("crimesDuringMonth length -----------  >> " + crimesDuringMonth.length);
   // console.log ('RESPONSE for crimesDuringMonth-------------------->');
   // console.log (crimesDuringMonth);
   // console.log ('LENGTH: crimesDuringMonth.length');
   // console.log (crimesDuringMonth.length);

    // If crimes exist for month being checked, add them to collection of crimes
    if (crimesDuringMonth.length > 3) {
      crimes.push (crimesDuringMonth);
      console.log ('crimes.push -> ' + crimesDuringMonth);
    }
  }

  //TODO filters for crimes on map <<<<<<<<<<<<<<<<<<<<<<<<<
  // Declare crime variables
  let crimeNodes = []; // Array to hold all found crimes location and information

  // Add category, and lat and lon locations for each crime
  for (let crimeCollection of crimes) {
    //console.log("crimeCollection for a month:")
    //console.log(crimeCollection);

    for (let aCrime of crimeCollection) {
      console.log ('Category: ' + aCrime.category);
      console.log ('LAT: ' + aCrime.location.latitude);
      console.log ('LON: ' + aCrime.location.longitude);

      let aCrimeCategory = aCrime.category;

      //TODO implement filters from interface
      // Filter crimes for user selected filters
      // if (!in_array(aCrimeCategory, filtered)) {
      //   aCrimeLat = $aCrime->location->latitude;
      //   aCrimeLon = $aCrime->location->longitude;
      //   aCrimedetails = array(
      //     'category' => aCrimeCategory,
      //     'latitude' => aCrimeLat,
      //     'longitude' => aCrimeLon
      //   );
      //   array_push(crimeNodes, aCrimedetails);
      // }

      // Store only first 98 crimes (mapquest API marker quantity imposed limit)
      //slicedCrimes = crimeNodes.slice(0,98);
    }
  }

  // If no crimes were found, set boolean flag
  if (slicedCrimes.length < 1) {
    noCrimes = true; //TODO send back if no crimes found to allow user alert in results page
  }

  // console.log("calling getMap with: boundingBox" + boundingBox + "\n"
  // + "slicedCrimes: " + slicedCrimes + "\n"
  // + "latitude: " + latitude + "\n"
  // + "longitude: " + longitude);
  // Get map image URL for lat and lon location
  mapURL = getMap (boundingBox, slicedCrimes, latitude, longitude);

  //invalidconsole.log("final mapURL:" + mapURL);
  //call method to get static map image URL centered on bounding box area
  //mapURL = testGetMap (boundingBox);

  //respond with data
  res.send ({
    location: location,
    namedlocation: namedLocation,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    mapurl: mapURL, //TODO send proper mapURL of location rather than test version
    numberofmonths: numberOfMonths,
    boundingbox: boundingBox,
    nocrimes: noCrimes,
  });
});

//TODO
// Function which calculates and returns lat and lon coordinates for a 1 mile square bounding box
// centered on a pair of lat and long coordinates
// function testgetBoundingBox(latLocation, lonLocation)
// {
//   boundingBox = [];

//   // Expand a bounding box to encompass approx 1 mile area of crimes centred at location
//   latBBTopLeft = round((float)latLocation + 0.004, 6); // Top left of bounding box
//   lonBBTopLeft = round((float)lonLocation - 0.009, 6); // Top left of bounding box
//   latBBBotRight = round((float)latLocation - 0.004, 6); // Bottom right of bounding box
//   lonBBBotRight = round((float)lonLocation + 0.009, 6); // Bottom right of bounding box
//   latBBTopRight = round((float)latLocation + 0.004, 6); // Top right of bounding box
//   lonBBTopRight = round((float)lonLocation + 0.009, 6); // Top right of bounding box
//   latBBBotLeft = round((float)latLocation - 0.004, 6); // Bottom left of bounding box
//   lonBBBotLeft = round((float)lonLocation - 0.009, 6); // Bottom left of bounding box

//   // Add bounding box coordinates to bounding box array
//   array_push(boundingBox,
//     latBBTopLeft,
//     lonBBTopLeft,
//     latBBBotRight,
//     lonBBBotRight,
//     latBBTopRight,
//     lonBBTopRight,
//     latBBBotLeft,
//     lonBBBotLeft);

//   return boundingBox;
// }

// const router = require ('express').Router ();

// // /api/map
// // GET map url

// router.post('/map', async (req, res) => {

//    console.log("req.body.title: " + req.body.title);
//   try {
//     const testResponse = "Working API";
//     res.status(200).json(testResponse);
//   } catch (e) {
//     res.status(400).json({ msg: e.message });
//   }
// });

// //router.route ('/map').get ((req, res) => {
// router.get ('/map/:title', async (req, res, next) => {
//       console.log("route /map triggered");
//       console.log ('req.body.title holds: ', req.body.title);
//   try {
//     const title = req.body.title;
//     //console.log(test);

//     //
//     //TEST
//     const testResponse = {
//      mapURL: 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x',
//     };

//     if (!req.body.title) {
//       console.log ('title was missing');
//       return res.json ('No map url');
//     }
//     res.send (testResponse); // Return value
//   } catch (err) {
//     res.json (err);
//   }
// });

// module.exports = router;

module.exports = router;
