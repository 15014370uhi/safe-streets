const { getYearAndMonth, populateCrimeDates } = require('../util/date-helpers');
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


// Function which stores the previous 12 months crime data
const getHistoricData = async (aBoundingBox) => {
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
            'No police force assigned (location likely outside England)'
          );
        }
        aPoliceForce = res.data.force; //e.g. {"force":"north-yorkshire","neighbourhood":"york-inner"}
      })
      .catch (error => {
        console.log ('error retrieving police force sector: ', error);
      });
  
    return aPoliceForce;
  };


  module.exports = {getPoliceForce, getCrimeData, getSector, getHistoricData};
  