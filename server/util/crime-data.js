const {getYearAndMonth, populateCrimeDates} = require ('./date-helpers');
const {improveMarkerVisibility} = require ('./geo-data');
const axios = require ('axios');

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
  
  // console.log('Bounding Box BEFORE CORRECTIONS in getCrimeData = \n'
  // + 'latTopLeft: ' + boundingBox[0] + ' lonTopLeft: ' + boundingBox[1] + '\n'
  // + 'latBotRight: ' + boundingBox[2] + ' lonBotRight: ' + boundingBox[3] + '\n'
  // + 'latTopRight: ' + boundingBox[4] + ' lonTopRight:' + boundingBox[5] + '\n'
  // + 'latBotLeft: ' + boundingBox[6] + ' lonBotLeft:' + boundingBox[7] + '\n'  
  // );

  var correction = 0.0015;

  let latTopLeft = parseFloat( (parseFloat(boundingBox[0])) - parseFloat(correction)).toFixed(5);
  let lonTopLeft = parseFloat( (parseFloat(boundingBox[1])) + parseFloat(correction)).toFixed(5);

  let latBotRight = parseFloat( (parseFloat(boundingBox[2])) + parseFloat(correction)).toFixed(5);
  let lonBotRight = parseFloat( (parseFloat(boundingBox[3])) - parseFloat(correction)).toFixed(5);

  let latTopRight = parseFloat( (parseFloat(boundingBox[4])) - parseFloat(correction)).toFixed(5);
  let lonTopRight = parseFloat( (parseFloat(boundingBox[5])) - parseFloat(correction)).toFixed(5);

  let latBotLeft = parseFloat( (parseFloat(boundingBox[6])) + parseFloat(correction)).toFixed(5);
  let lonBotLeft = parseFloat( (parseFloat(boundingBox[7])) + parseFloat(correction)).toFixed(5);


  // console.log('Bounding Box AFTER CORRECTIONS in getCrimeData = \n'
  // + 'latTopLeft: ' + latTopLeft + ' lonTopLeft: ' + lonTopLeft + '\n'
  // + 'latBotRight: ' + latBotRight + ' lonBotRight: ' + lonBotRight + '\n'
  // + 'latTopRight: ' + latTopRight + ' lonTopRight:' + lonTopRight + '\n'
  // + 'latBotLeft: ' + latBotLeft + ' lonBotLeft:' + lonBotLeft + '\n'  
  // );

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

    //console.log('\n ================ CRIME URL: ' + URLCrimes + '\n=================');
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
      console.log ('error retrieving crime data from police API: ', error);
    });

  // Return the crime data
  return crimeData;
};

// function which creates an array of all crimes to be displayed on map
const populateDisplayCrimes = async (crimes, filters) => {

  var displayCrimes = [];

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

      // if crime map filters were selected by user
      if (filters.length > 0) {
        // call function which creates a list of crime categories to display on map
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

        // add current crime to array of all crimes to display on map
        displayCrimes.push (aCrimeDetails);
      }
    }
  }

  // adjust crime marker locations to improve visibility
  displayCrimes = improveMarkerVisibility (displayCrimes);

  return displayCrimes;
};

// Function which stores the previous 12 months crime data
const getHistoricData = async aBoundingBox => {
  var crimeMonthsArrayHistoric = populateCrimeDates (12);
  var crimesHistoric = [];
  let crimesDuringMonthHistoric = []; //array to hold a specific month's crimes

  // get crime data for location for all months required
  for (let aMonth of crimeMonthsArrayHistoric) {
    crimesDuringMonthHistoric = await getCrimeData (aMonth, aBoundingBox);

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
  return displayCrimesHistoric;
};

// function which returns the sector for a given police force
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
    case 'avon-and-somerset':
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
        console.log (
          'No police force assigned to this area (location is likely outside England)'
        );
      }
      aPoliceForce = res.data.force; //e.g. {"force":"north-yorkshire","neighbourhood":"york-inner"}
    })
    .catch (error => {
      console.log ('error retrieving police force sector: ', error);
    });

  return aPoliceForce;
};

module.exports = {
  getPoliceForce,
  getCrimeData,
  populateDisplayCrimes,
  getSector,
  getHistoricData,
  applyFilters,
};
