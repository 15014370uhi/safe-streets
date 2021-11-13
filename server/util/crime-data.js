const {getYearAndMonth, populateCrimeDates} = require ('./date-helpers');
const {improveMarkerVisibility} = require ('./geo-data');
const axios = require ('axios');

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
  let latTopLeft = parseFloat (boundingBox[0]).toFixed (5);
  let lonTopLeft = parseFloat (boundingBox[1]).toFixed (5);

  let latBotRight = parseFloat (boundingBox[2]).toFixed (5);
  let lonBotRight = parseFloat (boundingBox[3]).toFixed (5);

  let latTopRight = parseFloat (boundingBox[4]).toFixed (5);
  let lonTopRight = parseFloat (boundingBox[5]).toFixed (5);

  let latBotLeft = parseFloat (boundingBox[6]).toFixed (5);
  let lonBotLeft = parseFloat (boundingBox[7]).toFixed (5);

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

   // console.log('crimeURL: ' + URLCrimes);

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
      console.log ('error retrieving crime data from police API: ', error + '\n' + URLCrimes);
    });

  // Return the crime data
  return crimeData;
};

// Function which creates an array of all crimes to be displayed on map
const populateAllCrimes = async crimes => {
  var allCrimes = [];

  // add crime details for each crime
  for (let crimeCollection of crimes) {
    for (let aCrime of crimeCollection) {
      // store details of current crime
      let aCrimeCategory = aCrime.category;
      let aCrimeLat = aCrime.location.latitude;
      let aCrimeLon = aCrime.location.longitude;
      let aCrimeDate = getYearAndMonth (aCrime.month);
      let aCrimeYear = aCrimeDate.getFullYear ();
      let aCrimeMonth = aCrimeDate.getMonth () + 1; //zero based count +1
      
      // create new object with crime details to add
      const aCrimeDetails = {
        category: aCrimeCategory,
        latitude: aCrimeLat,
        longitude: aCrimeLon,
        month: aCrimeMonth,
        year: aCrimeYear,
      };

      // add current crime to array of all crimes to display on map
      allCrimes.push (aCrimeDetails);
    }
  }

  // adjust crime marker locations to improve visibility
  allCrimes = improveMarkerVisibility (allCrimes);

  return allCrimes;
};

// Function which retrieves the previous 12 months crime data
const getHistoricCrimes = async aBoundingBox => {
  var crimeMonthsArrayHistoric = populateCrimeDates (12);
  var crimesHistoric = [];
  let crimesDuringMonthHistoric = []; //array to hold a specific month's crimes

  // get crime data for location for all months required
  for (let aMonth of crimeMonthsArrayHistoric) {

    crimesDuringMonthHistoric = await getCrimeData (aMonth, aBoundingBox);

    console.log('Historic - Number of crimes found for ' + aMonth + ' = ' 
    + crimesDuringMonthHistoric.length);

    // if crimes exist for month being checked, add them to collection of crimes
    if (
      //crimesDuringMonthHistoric !== undefined &&
      crimesDuringMonthHistoric.length > 0
    ) {
      crimesHistoric.push (crimesDuringMonthHistoric);
    }
  }

  // declare crime variables
  let historicCrimes = [];

  // add crime details for each crime
  for (let crimeCollection of crimesHistoric) {
    for (let aCrime of crimeCollection) {
      // store details of current crime
      let aCrimeCategory = aCrime.category;
      let aCrimeLat = aCrime.location.latitude;
      let aCrimeLon = aCrime.location.longitude;
      let aCrimeDate = getYearAndMonth (aCrime.month);
      let aCrimeYear = aCrimeDate.getFullYear ();
      let aCrimeMonth = aCrimeDate.getMonth () + 1; //zero based count +1

      // create new object with crime details to add
      const aCrimeDetails = {
        category: aCrimeCategory,
        latitude: aCrimeLat,
        longitude: aCrimeLon,
        month: aCrimeMonth,
        year: aCrimeYear,
      };
      // add current crime to array of all crimes to display on map
      historicCrimes.push (aCrimeDetails);
    }    
  }

  //console.log('returning historic crimes length: ' + historicCrimes.length);

  return historicCrimes;
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
  populateAllCrimes,
  getSector,
  getHistoricCrimes,
};
