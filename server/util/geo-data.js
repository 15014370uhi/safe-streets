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
  //API key
  const apiKey = process.env.MAPQUEST_API_KEY;

  //declare array to hold results
  var geoLocationData = {};

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

// function which improves the visibility of overlapping and identically positioned
// map markers, by adding a random value to latitude and longitude positions of crimes
const improveMarkerVisibility = displayCrimes => {
  var referenceLats = []; // to store duplicate latitudes
  var referencelons = []; // to store duplicate longitudes

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
    0.00010,
    0.00021,
    0.00027,
    0.00031,
    0.00039,
    0.0,
    -0.00013,
    -0.0002,
    -0.00025 - 0.00030,
    -0.0004,
  ];

  // iterate over all crimes - adjust the lat and lon of any duplicates so they show on map better
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

  // store max of 200 crimes, to cater to mapquest API map markers
  displayCrimes = displayCrimes.slice (0, 200); //TODO historic data should not be sliced

  return displayCrimes;
};


/**
	 * Function which checks if a latitude, longitude coordinate lies
	 * within the united kingdom boundary or not
	 * @param {Number} lat The latitude coordinate
	 * @param {Number} lon The longituded coordinate
	 *
	 * @returns {Boolean} isValidCoordinate Returns true if coordinate lies within UK
	 */
 const isWithinUK = (lat, lon) => {
		let isValidCoordinate = true;
		if (lat < 49.88 || lat > 60.86 || lon < -8.21 || lon > 1.77) {
			isValidCoordinate = false;
		}
		return isValidCoordinate;
	};

module.exports = {getLatLon, getBoundingBox, improveMarkerVisibility, isWithinUK};
