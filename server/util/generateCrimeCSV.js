const createCsvWriter = require ('csv-writer').createObjectCsvWriter;
const csv = require ('csv-parser');
const fs = require ('fs');

//TODO creating CSV file to be used by machine learning to predict
//TODO this data should match the data the model used to generate the module
//TODO the result of the model will depend on factors it used to determine
//TODO - so when user does a search - what do I know?
//TODO 1. a lat/lon central location for area, LSOA code, postcode, current month, year,
//TODO If I rely on building model based on LSOA instead of lat and lon, it might be better
//TODO since that is the info I will have from user search, lat lon might be off or throw off model based

/**
 * Function which creates a CSV of crime data suitable for machine learning algorithms
 * 
 */
//TODO TEST CSV WRITE
const generateCrimeCSV = crimeData => {
  //  var prediction = generateMLData (predictionYear, predictionMonth, latitude, longitude, LSOA_code, LSOA_name, postcode)

  console.log('generateCrimeCSV received: \n' 
    + 'year: ' + crimeData.year + '\n'
    + 'month_num: ' + crimeData.month_num + '\n'
    + 'lat: ' + crimeData.lat + '\n'
    + 'lon: ' + crimeData.lon + '\n'
    + 'LSOA_code: ' + crimeData.LSOA_code + '\n'
    + 'LSOA_name: ' + crimeData.LSOA_name + '\n'
    + 'postcode: ' + crimeData.postcode + '\n');

  const csvWriter = createCsvWriter ({
    path: '../server/crime-data/crimeCSVOutput.csv', //destination path for file
    header: [
      //TODO data headers I can provide to ML alogirthm model
      {id: 'year', title: 'Year'},
      {id: 'month_num', title: 'Month_num'},
      {id: 'lat', title: 'Latitude'},
      {id: 'lon', title: 'Longitude'},
      {id: 'LSOA_code', title: 'LSOA_code'},
      {id: 'LSOA_name', title: 'LSOA_name'},
      {id: 'postcode', title: 'postcode'},

      //TODO target add all occurences?
      //TODO if targetting occurences, maybe need occurences of particular types of more complex
      //TODO serious crime categories, or --- start with just calculating number of all crimes for area as Y
    ],
  });

  const data = [
    {
      year: crimeData.year,
      month_num: crimeData.month_num,
      lat: crimeData.lat,
      lon: crimeData.lon,
      LSOA_code: crimeData.LSOA_code,
      LSOA_name: crimeData.LSOA_name,
      postcode: crimeData.postcode,
    },
  ];

  csvWriter
    .writeRecords (data)
    .then (() => console.log ('The Crime CSV file was written successfully'));
};





//TODO change function to format data for machine learning?  or something
const editCrimeCSV = aFilePath => {
  //TODO get a CSV of data and edit it, then write to external CSV file
  //TODO pass data to machine learning.... then return results to routes function
  //TODO which called it, then use data to generate crime information for user for
  //TODO the specified area which is being search for crimes.

  //TEST
  const csvWriter = createCsvWriter ({
    path: aFilePath,
    header: [
      {id: 'name', title: 'Name'},
      {id: 'surname', title: 'Surname'},
      {id: 'age', title: 'Age'},
      {id: 'gender', title: 'Gender'},
    ],
  });

  const data = [
    {
      name: 'John',
      surname: 'Snow',
      age: 26,
      gender: 'M',
    },
    {
      name: 'Clair',
      surname: 'White',
      age: 33,
      gender: 'F',
    },
    {
      name: 'Fancy',
      surname: 'Brown',
      age: 78,
      gender: 'F',
    },
  ];

  csvWriter
    .writeRecords (data)
    .then (() => console.log ('The CSV file was written successfully'));
};

const testEditCSV = () => {
  fs
    .createReadStream ('data.csv')
    .pipe (csv ())
    .on ('data', row => {
      console.log (row);
    })
    .on ('end', () => {
      console.log ('CSV file successfully processed');
    });
};

module.exports = {generateCrimeCSV, editCrimeCSV};
