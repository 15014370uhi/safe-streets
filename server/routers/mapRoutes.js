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
  var boundingBox = []; // Initialise array to hold bounding box coordinates
  const latCorrection = 0.004; // Adjustment for latitude
  const lonCorrection = 0.009; // Adjustment for longitude
  const precision = 6; // Significant figures for Lat, lon coordinate

  // Top left coordinate of bounding box
  const latTopLeft = parseFloat (latLocation + latCorrection).toPrecision (
    precision
  );
  const lonTopLeft = parseFloat (lonLocation - lonCorrection).toPrecision (
    precision
  ); // Top left of bolatCorrection).toPrecision(precision);

  // Bottom right of bounding box
  const latBotRight = parseFloat (latLocation - latCorrection).toPrecision (
    precision
  );
  const lonBotRight = parseFloat (lonLocation + lonCorrection).toPrecision (
    precision
  );

  // Top right of bounding box
  const latTopRight = parseFloat (latLocation + latCorrection).toPrecision (
    precision
  );
  const lonTopRight = parseFloat (lonLocation + lonCorrection).toPrecision (
    precision
  );

  // Bottom left of bounding box
  const latBotLeft = parseFloat (latLocation - latCorrection).toPrecision (
    precision
  );
  const lonBotLeft = parseFloat (lonLocation - lonCorrection).toPrecision (
    precision
  );

  // Add bounding box coordinates to bounding box array
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

  return boundingBox;
};

//var URLGeocode;

// Function which returns the latitude and longitude of a named UK street location
const getGeocode = async locationName => {

  // Declare array to hold results
  var geoCoords = {};

  const apiKey = process.env.MAPQUEST_API_KEY;
  const baseURL = 'http://open.mapquestapi.com/geocoding/v1/address?key=';
  const URLGeocode = baseURL + apiKey + '&location=' + locationName + ',UK';

  // Async call to mapquest geocode API
  await axios
    .get (URLGeocode)
    .then (function (res) {

      // Record latitude and longitude for named location
      const latitude = res.data.results[0].locations[0].displayLatLng.lat;
      const longitude = res.data.results[0].locations[0].displayLatLng.lng;

      // Create results object for geo coordinates
      geoCoords = {
        latitude: latitude,
        longitude: longitude,
      };
    })
    .catch (error => {
      console.log ('error getting crime data: ', error);
    });

  // return coords object;
  return geoCoords;
};



/**
 * Returns JSON object containing all recorded crime data
 * for a 1 mile bounding box area at a given geographical location
 * for a given month.
 *
 * @param  {String} crimeMonth The month and year date to check
 * @param  {Array} boundingBox The bounding box coordinates
 * 
 * @return {json} crimeDataJSON The crime data
 */
const getCrimeData = async (crimeMonth, boundingBox) => {
  // Set lat and lon coordinates of bounding box
  const latTopLeft = boundingBox[0];
  const lonTopLeft = boundingBox[1];
  const latBotRight = boundingBox[2];
  const lonBotRight = boundingBox[3];
  const latTopRight = boundingBox[4];
  const lonTopRight = boundingBox[5];
  const latBotLeft = boundingBox[6];
  const lonBotLeft = boundingBox[7];

  // Base URL for polygon type area search of police crime data API
  const baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly=';

  // Generate complete URL for crime data API
  const URLCrimeData =
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
    crimeMonth;

  // TODO get the lat and long response and show on map screen as useful data?>
  // TODO maybe have a special area for information about the map at side?

  // API call for a new search
  await axios
    .get (URLCrimeData)
    .then (res => {
      // TEST response
      console.log (res.data);

      return res.data;
    })
    .catch (error => {
      console.log ('error getting crime data: ', error);
    });
};


// GET route 
//TODO maybe move to routes file instead
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch;
  var mapURL = '';
  var location = '';

  // TEST
  mapURL =
    'http://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';

  const namedLocation = req.body.namedlocation;
  let latitude = 0;
  let longitude = 0;
  const numberOfMonths = req.body.numberofmonths;

  if (isNameSearch) {
    // Named location search
    // TODO convert named location to lat long etc
    console.log ('Named Search!');

    // TODO get address from user search entry
    const testAddress = '9 errochty court, perth';

    // TODO FORM validation for each type of search - make sure it'snot empy
    // TODO or return the uk standard map is empty?  nah ask them to enter

    const geoCoords = await getGeocode (testAddress);
    latitude = geoCoords.latitude;
    longitude = geoCoords.longitude;

    console.log(typeof latitude);

    // TODO call function to get map URL
  } else {
    console.log ('LAT LON search!');

    // LAT LON search
    latitude = req.body.lat;
    longitude = req.body.lon;

    
    // TODO call function to get map URL ************* <<
  }


  res.send ({
    location: location,
    namedlocation: namedLocation,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    mapurl: mapURL,
    numberofmonths: numberOfMonths,
  });
});

module.exports = router;
