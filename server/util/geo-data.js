const mapquest = require ('mapquest');
const axios = require ('axios');

mapquest.key = process.env.MAPQUEST_API_KEY;

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

// function which improves the visibility of overlapping markers by randomly adjusting crime
// position slightly
const improveMarkerVisibility = displayCrimes => {
  var referenceLats = []; // store duplicate latitudes
  var referencelons = []; // store duplicate longitudes

  for (let aCrimeRecord of displayCrimes) {
    referenceLats.push (aCrimeRecord.latitude);
    referencelons.push (aCrimeRecord.longitude);
  }

  // get set of all crime latitudes
  var uniqueLats = [...new Set (referenceLats)];

  // get set of all crime longitudes
  var uniqueLons = [...new Set (referencelons)];

  // values to adjust crime marker location by
  var locationValues = [
    0.0002,
    0.0003,
    0.0004,
    0.0005,
    0.0006,
    0.0007,
    0.0009,
    0.0,
    -0.0002,
    -0.0003,
    -0.0004,
    -0.0005,
    -0.0006,
    -0.0007,
    -0.0008,
    -0.0009,
  ];

  //Iterate over all crimes - adjust the lat and lon of any duplicates so they show on map better
  for (let aCrimeRecord of displayCrimes) {
    if (uniqueLats.includes (aCrimeRecord.latitude)) {
      var randomValue =
        locationValues[Math.floor (Math.random () * locationValues.length)];
      var newLatVal =
        parseFloat (aCrimeRecord.latitude) + parseFloat (randomValue);
      newLatVal = parseFloat (newLatVal).toPrecision (7);
      aCrimeRecord.latitude = newLatVal;
    }

    if (uniqueLons.includes (aCrimeRecord.longitude)) {
      randomValue =
        locationValues[Math.floor (Math.random () * locationValues.length)];
      var newLonVal =
        parseFloat (aCrimeRecord.longitude) + parseFloat (randomValue);
      newLonVal = parseFloat (newLonVal).toPrecision (5);
      aCrimeRecord.longitude = newLonVal;
    }
  }
  
  // store max of 90 crimes, to cater to mapquest API map markers imposed limit
  displayCrimes = displayCrimes.slice (0, 90);

  return displayCrimes;
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

module.exports = {getMap, getLatLon, getBoundingBox, improveMarkerVisibility};
