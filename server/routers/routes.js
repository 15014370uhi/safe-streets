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

      //TODO check for not found location etc is there an error code?
      console.log (res.data);

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
 * for a 1 mile bounding box geographic area for a given month.
 *
 * @param  {String} crimeMonth The month and year to check
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

      return res.data; //TODO I think need to return this data set in this page, to get map icons added
    })
    .catch (error => {
      console.log ('error getting crime data: ', error);
    });
};



// GET route
router.post ('/', async (req, res) => {
  const isNameSearch = req.body.isnamesearch; // Boolean flag to determine if location name search
  var mapURL = ''; // Static map image URL
  var location = ''; // Variable to hold

  // TEST
  //mapURL ='http://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';

  const namedLocation = req.body.namedlocation;
  let latitude = req.body.lat;
  let longitude = req.body.lat;
  const numberOfMonths = req.body.numberofmonths;
  //let isUKLocation = false; // Will warn user with message

  // Named location search selected
  if (isNameSearch) {
    
    // TODO FORM validation for each type of search - make sure it's not empty
    // TODO or return the uk standard map is empty?  nah ask them to enter

    // Call function to convert named location to set of lat and lon coordinates
    const geoCoords = await getGeocode (namedLocation);

    //TODO - need to check if locatio name, is valid location or notSelectedFieldSet
    //TODO was there some error back from geocoding if location not found?

    latitude = geoCoords.latitude; //store returned lat coordinate
    longitude = geoCoords.longitude; //store returned lon coordinate    

    
  } else { //latitude and longitude search selected and coords input by user
    // Get latitude and longitude from request body
     latitude = req.body.lat;
     longitude = req.body.lon;   
  }

  // TODO call function to get map URL
  //TODO - now have lat and lon coords of location - whether manually entered or
  //TODO or returned from function.
  // Now need to TEST - by getting map image using the coordinates
  // Then - TEST by getting the crime data for the months required - rem the two month thing
  
  //call method to get bounding box lat and lon coordinates of area centered on latitude and longitude
  const boundingBox = getBoundingBox(latitude, longitude);

  //call method to get static map image URL centered on bounding box area
  mapURL = testGetMap(boundingBox);


  // Respond with data
  res.send ({
    location: location,
    namedlocation: namedLocation,
    isnamesearch: isNameSearch,
    lat: latitude,
    lon: longitude,
    mapurl: mapURL,   //TODO send proper mapURL of location rather than test version
    numberofmonths: numberOfMonths,
    boundingbox: boundingBox   
  });
});




//TODO  TEST  get static map (without crime data TESTS)
//TODO
// TEST return a static map image URL at a bounding box lat lon locatio
function testGetMap(boundingBox)
{
  
  // Define base URL
  let URLMap = "https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&boundingBox=";
  
  // Get reference to bounding box lat and lon coordinates
  const latTopLeft = boundingBox[0];
  const lonTopLeft = boundingBox[1];
  const latBotRight = boundingBox[2];
  const lonBotRight = boundingBox[3];

  // Add bounding box lat and lon coordinates to base URL string
  URLMap += latTopLeft + "," 
          + lonTopLeft + "," 
          + latBotRight + ","
          + lonBotRight;

          // Add url ending
  //URLMap += "&zoom=15&size=600,400@2x";
  URLMap += "&zoom=16&size=600,600@2x";  //TODO TESTing taller map and zoomed closer

  // Return URL for static map with crime locations marked
  return URLMap;
}




//TODO
// Function which returns a static map image URL containing crime locations
function getMap(boundingBox, crimeNodes, latLocation, lonLocation)
{
  // Boolean to determine first lat and lon location
  let isFirstLocation = true;

  // Define base URL
  let URLMap = "https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&boundingBox=";

  // Get reference to bounding box lat and lon coordinates
  const latTopLeft = boundingBox[0];
  const lonTopLeft = boundingBox[1];
  const latBotRight = boundingBox[2];
  const lonBotRight = boundingBox[3];
  let category = '';
  let colour = '';
  let symbol = '';

  
  // Add bounding box lat and lon coordinates to base URL string
  URLMap =  URLMap 
          + latTopLeft + "," 
          + lonTopLeft + "," 
          + latBotRight + "," 
          + lonBotRight + "&locations=";


  // Iterate through array of all crime records and add lat, lon, category and map marker to URL string
  for (const aCrimeRecord in crimeNodes) {

    // Set options for each crime type
    switch (aCrimeRecord['category']) {

        // General Disorder
      case 'anti-social-behaviour':
        category = 'Anti';
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

        // Public Order Crimes
      case 'criminal-damage-arson':
      case 'public-order':
      case 'other-crime':
        category = 'Ordr';
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

        // Violent Crime
      case 'violent-crime':
      case 'theft-from-the-person':
        category = 'Viol';
        colour = "FF0000";
        symbol = "flag-sm-";
        break;

        // Weapons
      case 'possession-of-weapons':
        category = 'Weapn';
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

        // General Theft
      case 'other-theft':
      case 'shoplifting':
      case 'bicycle-theft':
        category = 'Theft';
        colour = "00FF00";
        symbol = "flag-sm-";
        break;

        // Vehicle Crime
      case 'vehicle-crime':
        category = 'Vehic';
        colour = "3B5998-22407F";
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

        // Robbery
      case 'robbery':
        category = 'Robber';
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

        // Drugs
      case 'drugs':
        category = 'Drugs';
        colour = "FFFF00";
        symbol = "flag-sm-";
        break;

        // Burglary
      case 'burglary':
        category = 'Burg';
        colour = "7B0099";
        symbol = "flag-sm-";
        break;

      default:
        //TODO some default symbol for uncarterognised version ***
        break;

    }

    if (isFirstLocation) {
      URLMap = URLMap 
              + latLocation + "," 
              + lonLocation + "|" 
              + "marker-7B0099";
      isFirstLocation = false;

    } else {
      URLMap = URLMap + "||" 
              + aCrimeRecord['latitude'] + "," 
              + aCrimeRecord['longitude'] + "|" 
              + symbol 
              + colour + "-"
              + category;
    }
  };

  // Add url ending
  URLMap = URLMap + "&zoom=15&size=600,400@2x";

  // Return URL for static map with crime locations marked
  return URLMap;
}



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




























module.exports = router;


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
